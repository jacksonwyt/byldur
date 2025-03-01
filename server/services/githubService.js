// server/services/githubService.js
const axios = require('axios');
const { Octokit } = require('@octokit/rest');

class GitHubService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.octokit = new Octokit({
      auth: accessToken
    });
  }

  /**
   * Sync a project with a GitHub repository
   * @param {Object} project - The project to sync
   * @param {String} repoName - The repository name
   * @param {String} description - The repository description
   * @returns {Promise<Object>} - The repository information
   */
  async syncProject(project, repoName, description = '') {
    try {
      // Check if repo exists
      let repo;
      try {
        const { data } = await this.octokit.repos.get({
          owner: project.ownerLogin,
          repo: repoName
        });
        repo = data;
      } catch (error) {
        if (error.status === 404) {
          // Create the repository if it doesn't exist
          const { data } = await this.octokit.repos.createForAuthenticatedUser({
            name: repoName,
            description: description || `Byldur website: ${project.name}`,
            private: project.isPrivate || false,
            auto_init: true
          });
          repo = data;
        } else {
          throw error;
        }
      }

      // Generate files from project
      const files = this.generateFilesFromProject(project);

      // Get the default branch
      const branch = repo.default_branch || 'main';

      // Get the latest commit on the branch
      const { data: refData } = await this.octokit.git.getRef({
        owner: repo.owner.login,
        repo: repo.name,
        ref: `heads/${branch}`
      });
      const commitSha = refData.object.sha;

      // Create a new tree with project files
      const { data: treeData } = await this.octokit.git.createTree({
        owner: repo.owner.login,
        repo: repo.name,
        base_tree: commitSha,
        tree: files.map(file => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content
        }))
      });

      // Create a new commit
      const { data: commitData } = await this.octokit.git.createCommit({
        owner: repo.owner.login,
        repo: repo.name,
        message: `Update from Byldur at ${new Date().toISOString()}`,
        tree: treeData.sha,
        parents: [commitSha]
      });

      // Update the reference
      await this.octokit.git.updateRef({
        owner: repo.owner.login,
        repo: repo.name,
        ref: `heads/${branch}`,
        sha: commitData.sha
      });

      // Return the repository information
      return {
        repoUrl: repo.html_url,
        pagesUrl: repo.has_pages ? `https://${repo.owner.login}.github.io/${repo.name}` : null,
        repoName: repo.name,
        ownerLogin: repo.owner.login
      };
    } catch (error) {
      console.error('GitHub sync error:', error);
      throw new Error(error.message || 'Failed to sync with GitHub');
    }
  }

  /**
   * Generate files from a project
   * @param {Object} project - The project
   * @returns {Array<Object>} - Array of file objects
   */
  generateFilesFromProject(project) {
    // Generate HTML file
    const html = this.generateHTML(project.content);
    
    // Generate CSS file
    const css = this.generateCSS(project.content);
    
    // Generate JS file
    const js = this.generateJS(project.content);
    
    // Generate byldur project file
    const byldurProject = JSON.stringify(project.content, null, 2);
    
    const files = [
      {
        path: 'index.html',
        content: html
      },
      {
        path: 'styles.css',
        content: css
      },
      {
        path: 'script.js',
        content: js
      },
      {
        path: 'byldur-project.json',
        content: byldurProject
      }
    ];
    
    return files;
  }
  
  /**
   * Generate HTML from project content
   * @param {Object} content - The project content
   * @returns {String} - The HTML code
   */
  generateHTML(content) {
    // This is a simplified implementation
    // In practice, you'd extract this from the GrapesJS project data
    const htmlContent = content.html || '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.name || 'Byldur Website'}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${htmlContent}
  <script src="script.js"></script>
</body>
</html>`;
  }
  
  /**
   * Generate CSS from project content
   * @param {Object} content - The project content
   * @returns {String} - The CSS code
   */
  generateCSS(content) {
    // This is a simplified implementation
    // In practice, you'd extract this from the GrapesJS project data
    return content.css || '';
  }
  
  /**
   * Generate JS from project content
   * @param {Object} content - The project content
   * @returns {String} - The JS code
   */
  generateJS(content) {
    // This is a simplified implementation
    // In practice, you'd extract this from the GrapesJS project data
    return content.js || '';
  }
  
  /**
   * Publish a project to GitHub Pages
   * @param {String} ownerLogin - The repository owner login
   * @param {String} repoName - The repository name
   * @returns {Promise<Object>} - The pages information
   */
  async publishToGitHubPages(ownerLogin, repoName) {
    try {
      // Enable GitHub Pages for the repository
      const { data } = await this.octokit.repos.enablePagesSite({
        owner: ownerLogin,
        repo: repoName,
        source: {
          branch: 'main',
          path: '/'
        }
      });
      
      return {
        pagesUrl: data.html_url,
        status: data.status
      };
    } catch (error) {
      console.error('GitHub Pages error:', error);
      throw new Error(error.message || 'Failed to publish to GitHub Pages');
    }
  }
  
  /**
   * Pull project from GitHub repository
   * @param {String} ownerLogin - The repository owner login
   * @param {String} repoName - The repository name
   * @returns {Promise<Object>} - The project content
   */
  async pullFromGitHub(ownerLogin, repoName) {
    try {
      // Get the byldur project file
      const { data: byldurFile } = await this.octokit.repos.getContent({
        owner: ownerLogin,
        repo: repoName,
        path: 'byldur-project.json'
      });
      
      // Decode the content
      const content = Buffer.from(byldurFile.content, 'base64').toString();
      
      // Parse the JSON
      return JSON.parse(content);
    } catch (error) {
      // If byldur project file doesn't exist, try to reconstruct from separate files
      if (error.status === 404) {
        return this.reconstructProjectFromFiles(ownerLogin, repoName);
      }
      
      console.error('GitHub pull error:', error);
      throw new Error(error.message || 'Failed to pull from GitHub');
    }
  }
  
  /**
   * Reconstruct project from separate files
   * @param {String} ownerLogin - The repository owner login
   * @param {String} repoName - The repository name
   * @returns {Promise<Object>} - The project content
   */
  async reconstructProjectFromFiles(ownerLogin, repoName) {
    try {
      // Get HTML file
      const { data: htmlFile } = await this.octokit.repos.getContent({
        owner: ownerLogin,
        repo: repoName,
        path: 'index.html'
      });
      
      // Get CSS file
      const { data: cssFile } = await this.octokit.repos.getContent({
        owner: ownerLogin,
        repo: repoName,
        path: 'styles.css'
      });
      
      // Get JS file
      const { data: jsFile } = await this.octokit.repos.getContent({
        owner: ownerLogin,
        repo: repoName,
        path: 'script.js'
      });
      
      // Decode the contents
      const html = Buffer.from(htmlFile.content, 'base64').toString();
      const css = Buffer.from(cssFile.content, 'base64').toString();
      const js = Buffer.from(jsFile.content, 'base64').toString();
      
      // Create a project structure GrapesJS can understand
      // This is a simplified implementation that would need customization
      // based on your exact GrapesJS configuration and needs
      return {
        html,
        css,
        js,
        components: []  // You'd need to parse HTML into GrapesJS components
      };
    } catch (error) {
      console.error('GitHub reconstruction error:', error);
      throw new Error('Failed to reconstruct project from GitHub files');
    }
  }
}

module.exports = GitHubService;