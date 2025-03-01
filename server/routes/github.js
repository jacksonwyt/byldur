// server/routes/github.js
const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { isAuthenticated } = require('../middleware/auth');

// GitHub OAuth routes (no auth needed)
router.get('/auth', githubController.startGitHubAuth);
router.get('/callback', githubController.handleGitHubCallback);

// GitHub API routes (auth required)
router.use(isAuthenticated);
router.get('/status', githubController.getGitHubStatus);
router.post('/sync', githubController.syncToGitHub);
router.get('/pull', githubController.pullFromGitHub);
router.post('/pages', githubController.deployToGitHubPages);
router.get('/repos', githubController.getUserRepos);

module.exports = router;