// server/controllers/githubController.js
const GitHubService = require('../services/githubService');
const { User } = require('../models');
const crypto = require('crypto');

/**
 * Start GitHub OAuth process
 */
exports.startGitHubAuth = (req, res) => {
  try {
    // Client ID from env variables
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    if (!clientId) {
      return res.status(500).json({ message: 'GitHub integration is not properly configured' });
    }
    
    // Generate a state parameter for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    req.session.githubOAuthState = state;
    
    // Redirect URL to GitHub OAuth
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=${state}`;
    
    // Save the current URL to redirect back after auth
    req.session.returnTo = req.headers.referer || '/editor.html';
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({ message: 'Failed to start GitHub authentication' });
  }
};

/**
 * Handle GitHub OAuth callback
 */
exports.handleGitHubCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    
    // Validate state parameter to prevent CSRF attacks
    if (!code || !state || state !== req.session.githubOAuthState) {
      return res.redirect('/editor.html?error=github_auth_invalid');
    }
    
    // Clear the state from session to prevent replay attacks
    delete req.session.githubOAuthState;
    
    // Exchange code for access token
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.redirect('/editor.html?error=github_token_failed');
    }
    
    // Store the token in the user's record if logged in
    if (req.isAuthenticated()) {
      const user = await User.findByPk(req.user.id);
      user.githubToken = tokenData.access_token;
      user.githubConnected = true;
      await user.save();
    } else {
      // Store in session for non-logged in users
      req.session.githubToken = tokenData.access_token;
    }
    
    // Redirect back to the original URL
    const returnTo = req.session.returnTo || '/editor.html';
    delete req.session.returnTo;
    
    res.redirect(returnTo + '?github=connected');
  } catch (error) {
    console.error('GitHub callback error:', error);
    res.redirect('/editor.html?error=github_auth_error');
  }
};

/**
 * Get GitHub connection status
 */
exports.getGitHubStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.json({
      connected: !!user.githubConnected,
      username: user.githubUsername || null
    });
  } catch (error) {
    console.error('GitHub status error:', error);
    res.status(500).json({ message: 'Failed to get GitHub status' });
  }
};

/**
 * Sync project to GitHub
 */
exports.syncToGitHub = async (req, res) => {
  try {
    const { repoName, description, isPrivate, project } = req.body;
    
    if (!repoName || !project) {
      return res.status(400).json({ message: 'Repository name and project are required' });
    }
    
    // Validate repository name format (alphanumeric, hyphens, and underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(repoName)) {
      return res.status(400).json({ message: 'Invalid repository name format. Use only letters, numbers, hyphens, and underscores.' });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user.githubToken) {
      return res.status(401).json({ message: 'GitHub not connected' });
    }
    
    // Create GitHub service instance
    const githubService = new GitHubService(user.githubToken);
    
    // Prepare project for sync
    const projectToSync = {
      ...project,
      ownerLogin: user.githubUsername,
      isPrivate: isPrivate || false
    };
    
    // Sync to GitHub
    const result = await githubService.syncProject(projectToSync, repoName, description);
    
    res.json(result);
  } catch (error) {
    console.error('GitHub sync error:', error);
    res.status(500).json({ message: 'Failed to sync with GitHub' });
  }
};

/**
 * Pull project from GitHub
 */
exports.pullFromGitHub = async (req, res) => {
  try {
    const { repo } = req.query;
    
    if (!repo) {
      return res.status(400).json({ message: 'Repository name is required' });
    }
    
    // Validate repository name format (alphanumeric, hyphens, and underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(repo)) {
      return res.status(400).json({ message: 'Invalid repository name format' });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user.githubToken) {
      return res.status(401).json({ message: 'GitHub not connected' });
    }
    
    // Create GitHub service instance
    const githubService = new GitHubService(user.githubToken);
    
    // Pull from GitHub
    const content = await githubService.pullFromGitHub(user.githubUsername, repo);
    
    res.json({
      name: repo,
      content
    });
  } catch (error) {
    console.error('GitHub pull error:', error);
    res.status(500).json({ message: 'Failed to pull from GitHub' });
  }
};

/**
 * Deploy to GitHub Pages
 */
exports.deployToGitHubPages = async (req, res) => {
  try {
    const { repoName } = req.body;
    
    if (!repoName) {
      return res.status(400).json({ message: 'Repository name is required' });
    }
    
    // Validate repository name format (alphanumeric, hyphens, and underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(repoName)) {
      return res.status(400).json({ message: 'Invalid repository name format' });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user.githubToken) {
      return res.status(401).json({ message: 'GitHub not connected' });
    }
    
    // Create GitHub service instance
    const githubService = new GitHubService(user.githubToken);
    
    // Deploy to GitHub Pages
    const result = await githubService.publishToGitHubPages(user.githubUsername, repoName);
    
    res.json(result);
  } catch (error) {
    console.error('GitHub Pages deploy error:', error);
    res.status(500).json({ message: 'Failed to deploy to GitHub Pages' });
  }
};

/**
 * Get user repositories
 */
exports.getUserRepos = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user.githubToken) {
      return res.status(401).json({ message: 'GitHub not connected' });
    }
    
    // Create GitHub service instance with user token
    const githubService = new GitHubService(user.githubToken);
    
    // Get repositories from GitHub API using Octokit
    const { data } = await githubService.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    // Map to simplified format
    const repos = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      updatedAt: repo.updated_at
    }));
    
    res.json({ repos });
  } catch (error) {
    console.error('GitHub repos error:', error);
    res.status(500).json({ message: 'Failed to get GitHub repositories' });
  }
};