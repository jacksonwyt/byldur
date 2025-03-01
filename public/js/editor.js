// editor.js - Main editor functionality
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let editor;
    let isAuthenticated = false;
    let hasAiSubscription = false;
    let user = null;
    let currentTemplate = null;
    
    // Feature requirements
    const features = {
      requiresAuth: ['save', 'publish', 'github', 'ai'],
      requiresSubscription: ['ai']
    };
    
    // Initialize editor
    initEditor();
    
    /**
     * Initialize the GrapesJS editor
     */
    async function initEditor() {
      // Check if user is already logged in
      await checkAuth();
      
      // Get template from URL if any
      const urlParams = new URLSearchParams(window.location.search);
      currentTemplate = urlParams.get('template');
      
      // Initialize the editor
      editor = grapesjs.init({
        container: '#gjs',
        height: 'calc(100vh - 50px)',
        width: 'auto',
        storageManager: {
          type: 'local',
          autosave: true,
          autoload: currentTemplate ? false : true,
          stepsBeforeSave: 1
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            },
          ]
        },
        panels: {
          defaults: [
            // Default panels configuration
          ]
        },
        // Add more GrapesJS options as needed
      });
      
      // Hide loading overlay
      document.getElementById('loading-overlay').style.display = 'none';
      
      // Add event listeners
      setupEventListeners();
      
      // Load template if specified
      if (currentTemplate) {
        loadTemplate(currentTemplate);
      }
      
      // Initialize AI features if available
      if (isAuthenticated && hasAiSubscription) {
        initAIFeatures();
      }
    }
    
    /**
     * Check if the user is authenticated
     */
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          user = data.user;
          isAuthenticated = true;
          
          // Check if user has active AI subscription
          if (user.subscription && (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai')) {
            hasAiSubscription = true;
          }
          
          return true;
        } else {
          isAuthenticated = false;
          return false;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        isAuthenticated = false;
        return false;
      }
    }
    
    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
      // Save button
      document.getElementById('save-btn').addEventListener('click', function() {
        handleFeatureAccess('save', saveProject);
      });
      
      // Preview button
      document.getElementById('preview-btn').addEventListener('click', previewProject);
      
      // Publish button
      document.getElementById('publish-btn').addEventListener('click', function() {
        handleFeatureAccess('publish', publishProject);
      });
      
      // GitHub sync button
      document.getElementById('github-sync-btn').addEventListener('click', function() {
        handleFeatureAccess('github', openGitHubModal);
      });
      
      // AI assist button
      document.getElementById('ai-assist-btn').addEventListener('click', function() {
        handleFeatureAccess('ai', toggleAIPanel);
      });
      
      // Save to device button
      document.getElementById('saveLocalBtn').addEventListener('click', saveToDevice);
      
      // Load file button
      document.getElementById('loadFileBtn').addEventListener('click', function() {
        document.getElementById('projectFileInput').click();
      });
      
      // File input change
      document.getElementById('projectFileInput').addEventListener('change', loadFromDevice);
      
      // Auth modal tabs
      document.querySelectorAll('#auth-modal .tab').forEach(tab => {
        tab.addEventListener('click', function() {
          document.querySelectorAll('#auth-modal .tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('#auth-modal .tab-content').forEach(c => c.classList.remove('active'));
          
          this.classList.add('active');
          document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
      });
      
      // Auth modal forms
      document.getElementById('login-form').addEventListener('submit', handleLogin);
      document.getElementById('register-form').addEventListener('submit', handleRegister);
      
      // Modal close buttons
      document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
          const modal = this.closest('.modal');
          modal.style.display = 'none';
        });
      });
      
      // GitHub modal buttons
      document.getElementById('github-auth-btn').addEventListener('click', authenticateWithGitHub);
      document.getElementById('sync-to-github-btn').addEventListener('click', syncToGitHub);
      document.getElementById('pull-from-github-btn').addEventListener('click', pullFromGitHub);
      document.getElementById('deploy-github-pages-btn').addEventListener('click', deployToGitHubPages);
      
      // Subscription modal buttons
      document.querySelectorAll('.subscription-btn').forEach(button => {
        button.addEventListener('click', function() {
          handleSubscription(this.dataset.plan);
        });
      });
      
      // Project save modal button
      document.getElementById('confirm-save').addEventListener('click', confirmSaveProject);
      
      // Preview device buttons
      document.querySelectorAll('.preview-device-btn').forEach(button => {
        button.addEventListener('click', function() {
          document.querySelectorAll('.preview-device-btn').forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          const device = this.dataset.device;
          const iframe = document.getElementById('preview-iframe');
          
          switch (device) {
            case 'desktop':
              iframe.style.width = '100%';
              break;
            case 'tablet':
              iframe.style.width = '768px';
              break;
            case 'mobile':
              iframe.style.width = '320px';
              break;
          }
        });
      });
      
      // Close modals when clicking outside
      window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
      });
    }
    
    /**
     * Handle feature access check
     * @param {string} feature - Feature to check access for
     * @param {Function} callback - Callback to run if access is granted
     */
    function handleFeatureAccess(feature, callback) {
      if (features.requiresAuth.includes(feature) && !isAuthenticated) {
        showAuthModal(`Please sign in to use the ${feature} feature`);
        return;
      }
      
      if (features.requiresSubscription.includes(feature) && !hasAiSubscription) {
        showSubscriptionModal();
        return;
      }
      
      callback();
    }
    
    /**
     * Show authentication modal
     * @param {string} message - Message to display
     */
    function showAuthModal(message = 'Please sign in to continue') {
      document.getElementById('auth-modal-message').textContent = message;
      document.getElementById('auth-modal').style.display = 'block';
    }
    
    /**
     * Show subscription modal
     */
    function showSubscriptionModal() {
      document.getElementById('subscription-modal').style.display = 'block';
    }
    
    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    async function handleLogin(e) {
      e.preventDefault();
      const errorElement = document.getElementById('login-error');
      errorElement.textContent = '';
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
          }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          isAuthenticated = true;
          user = data.user;
          
          // Check if user has active AI subscription
          if (user.subscription && (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai')) {
            hasAiSubscription = true;
            initAIFeatures();
          }
          
          // Close modal
          document.getElementById('auth-modal').style.display = 'none';
        } else {
          errorElement.textContent = data.error || 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'A network error occurred. Please try again.';
      }
    }
    
    /**
     * Handle register form submission
     * @param {Event} e - Form submit event
     */
    async function handleRegister(e) {
      e.preventDefault();
      const errorElement = document.getElementById('register-error');
      errorElement.textContent = '';
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: document.getElementById('register-username').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
          }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          isAuthenticated = true;
          user = data.user;
          
          // Close modal
          document.getElementById('auth-modal').style.display = 'none';
          
          // Show welcome message
          alert('Account created successfully! Welcome to Byldur.');
        } else {
          errorElement.textContent = data.error || 'Registration failed. Please try again.';
        }
      } catch (error) {
        console.error('Registration error:', error);
        errorElement.textContent = 'A network error occurred. Please try again.';
      }
    }
    
    /**
     * Handle subscription purchase
     * @param {string} plan - Subscription plan
     */
    async function handleSubscription(plan) {
      try {
        const response = await fetch('/api/subscriptions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.message || 'Failed to start subscription process');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        alert('An error occurred while processing your subscription');
      }
    }
    
    /**
     * Save project (show modal)
     */
    function saveProject() {
      document.getElementById('project-name-modal').style.display = 'block';
    }
    
    /**
     * Confirm save project
     */
    async function confirmSaveProject() {
      const projectName = document.getElementById('projectName').value;
      
      if (!projectName) {
        alert('Please enter a project name');
        return;
      }
      
      try {
        document.getElementById('project-name-modal').style.display = 'none';
        
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            content: editor.getProjectData(),
            isPublic: document.getElementById('isPublic').checked
          }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          alert('Project saved successfully!');
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to save project');
        }
      } catch (error) {
        console.error('Save error:', error);
        alert('An error occurred while saving your project');
      }
    }
    
    /**
     * Save project to device
     */
    function saveToDevice() {
      const projectData = editor.getProjectData();
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const projectName = document.getElementById('projectName')?.value || 'byldur-project';
      const exportFileDefaultName = `${projectName}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
    
    /**
     * Load project from device
     * @param {Event} e - File input change event
     */
    function loadFromDevice(e) {
      const file = e.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          try {
            const projectData = JSON.parse(event.target.result);
            editor.loadProjectData(projectData);
            
            // Reset the file input
            document.getElementById('projectFileInput').value = '';
            
            alert('Project loaded successfully!');
          } catch (error) {
            console.error('Load error:', error);
            alert('Failed to load project. The file might be corrupted.');
          }
        };
        
        reader.readAsText(file);
      }
    }
    
    /**
     * Preview the current project
     */
    function previewProject() {
      const projectData = editor.getProjectData();
      const html = projectData.html || '';
      const css = projectData.css || '';
      const js = projectData.js || '';
      
      // Create a preview window
      const previewModal = document.getElementById('preview-modal');
      const iframe = document.getElementById('preview-iframe');
      
      previewModal.style.display = 'block';
      
      // Write content to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }
    
    /**
     * Publish the current project
     */
    async function publishProject() {
      const projectName = document.getElementById('projectName').value;
      
      if (!projectName) {
        alert('Please save your project first');
        saveProject();
        return;
      }
      
      // If user has GitHub connected, suggest publishing to GitHub Pages
      if (isGitHubConnected()) {
        if (confirm('Would you like to publish this project to GitHub Pages?')) {
          openGitHubModal();
          return;
        }
      }
      
      try {
        const response = await fetch('/api/projects/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName,
            content: editor.getProjectData()
          }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          alert(`Your website has been published! It's available at: ${data.publishedUrl}`);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to publish project');
        }
      } catch (error) {
        console.error('Publish error:', error);
        alert('An error occurred while publishing your project');
      }
    }
    
    /**
     * Check if user has connected GitHub
     * @returns {boolean} - Whether GitHub is connected
     */
    function isGitHubConnected() {
      return user && user.githubConnected;
    }
    
    /**
     * Open GitHub sync modal
     */
    function openGitHubModal() {
      if (isGitHubConnected()) {
        // Show sync section and hide auth section
        document.getElementById('github-auth-section').style.display = 'none';
        document.getElementById('github-sync-section').style.display = 'block';
      } else {
        // Show auth section and hide sync section
        document.getElementById('github-auth-section').style.display = 'block';
        document.getElementById('github-sync-section').style.display = 'none';
      }
      
      document.getElementById('github-modal').style.display = 'block';
    }
    
    /**
     * Authenticate with GitHub
     */
    function authenticateWithGitHub() {
      // Store current editor state in local storage to preserve it
      localStorage.setItem('byldur_temp_project', JSON.stringify(editor.getProjectData()));
      
      // Redirect to GitHub OAuth endpoint
      window.location.href = '/api/github/auth';
    }
    
    /**
     * Sync current project to GitHub
     */
    async function syncToGitHub() {
      const repoName = document.getElementById('repo-name').value;
      const repoDescription = document.getElementById('repo-description').value;
      const isPrivate = document.getElementById('repo-private').checked;
      
      if (!repoName) {
        alert('Please enter a repository name');
        return;
      }
      
      try {
        const response = await fetch('/api/github/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repoName,
            description: repoDescription,
            isPrivate,
            project: {
              name: document.getElementById('projectName').value || 'Untitled Project',
              content: editor.getProjectData()
            }
          }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          alert(`Project successfully synced to GitHub: ${data.repoUrl}`);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to sync with GitHub');
        }
      } catch (error) {
        console.error('GitHub sync error:', error);
        alert('An error occurred while syncing with GitHub');
      }
    }
    
    /**
     * Pull project from GitHub
     */
    async function pullFromGitHub() {
      const repoName = document.getElementById('repo-name').value;
      
      if (!repoName) {
        alert('Please enter a repository name');
        return;
      }
      
      try {
        const response = await fetch(`/api/github/pull?repo=${repoName}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Load project data into editor
          editor.loadProjectData(data.content);
          
          // Update project name
          const projectNameInput = document.getElementById('projectName');
          if (projectNameInput && data.name) {
            projectNameInput.value = data.name;
          }
          
          alert('Project successfully pulled from GitHub');
          document.getElementById('github-modal').style.display = 'none';
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to pull from GitHub');
        }
      } catch (error) {
        console.error('GitHub pull error:', error);
        alert('An error occurred while pulling from GitHub');
      }
    }
    
    /**
     * Deploy current project to GitHub Pages
     */
    async function deployToGitHubPages() {
      const repoName = document.getElementById('repo-name').value;
      
      if (!repoName) {
        alert('Please enter a repository name');
        return;
      }
      
      try {
        // First sync to GitHub
        await syncToGitHub();
        
        // Then deploy to GitHub Pages
        const response = await fetch('/api/github/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repoName
          }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          alert(`Your website is now deployed to GitHub Pages: ${data.pagesUrl}`);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to deploy to GitHub Pages');
        }
      } catch (error) {
        console.error('GitHub Pages deploy error:', error);
        alert('An error occurred while deploying to GitHub Pages');
      }
    }
    
    /**
     * Load a template into the editor
     * @param {string} templateName - Template name to load
     */
    async function loadTemplate(templateName) {
      try {
        document.getElementById('loading-overlay').style.display = 'flex';
        
        const response = await fetch(`/api/templates/${templateName}`);
        
        if (!response.ok) {
          throw new Error('Failed to load template');
        }
        
        const template = await response.json();
        
        // Load template data into editor
        editor.loadProjectData(template.content);
        
        // Set project name based on template
        const projectNameInput = document.getElementById('projectName');
        if (projectNameInput) {
          projectNameInput.value = template.name;
        }
        
        document.getElementById('loading-overlay').style.display = 'none';
      } catch (error) {
        console.error('Template loading error:', error);
        alert('Failed to load template. Starting with blank project.');
        document.getElementById('loading-overlay').style.display = 'none';
      }
    }
    
    /**
     * Toggle AI panel visibility
     */
    function toggleAIPanel() {
      // This function would be implemented fully in the ai-editor.js
      // But we'll add a simple check here
      if (window.aiEditor) {
        editor.runCommand('open-ai-panel');
      } else {
        initAIFeatures();
      }
    }
    
    /**
     * Initialize AI features
     */
    function initAIFeatures() {
      // Load AI script if it's not already loaded
      if (!window.aiEditor) {
        const script = document.createElement('script');
        script.src = '/js/ai-editor.js';
        script.onload = function() {
          if (typeof AIEditorIntegration !== 'undefined') {
            window.aiEditor = new AIEditorIntegration(editor);
          }
        };
        document.head.appendChild(script);
      }
    }
  }); 