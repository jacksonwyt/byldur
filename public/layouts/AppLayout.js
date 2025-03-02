/**
 * AppLayout - The main application layout
 * Handles the overall structure with navbar, sidebar, and content area
 */
class AppLayout {
  constructor(options = {}) {
    this.options = {
      showSidebar: true,
      activeMenuItem: '',
      showEditorActions: false,
      sidebarSections: [],
      ...options
    };
    
    this.elements = {
      appContainer: null,
      navbarContainer: null,
      sidebarContainer: null,
      contentContainer: null
    };
    
    this.components = {
      navbar: null,
      sidebar: null
    };
    
    this.init();
  }
  
  init() {
    // Create the main application structure
    document.body.innerHTML = `
      <div class="app-container" id="app-container">
        <div id="navbar-container"></div>
        <div class="app-content">
          ${this.options.showSidebar ? '<div id="sidebar-container"></div>' : ''}
          <main class="main-content" id="main-content"></main>
        </div>
      </div>
    `;
    
    // Store element references
    this.elements.appContainer = document.getElementById('app-container');
    this.elements.navbarContainer = document.getElementById('navbar-container');
    this.elements.contentContainer = document.getElementById('main-content');
    
    if (this.options.showSidebar) {
      this.elements.sidebarContainer = document.getElementById('sidebar-container');
    }
    
    // Initialize components
    this.initComponents();
    
    // Check authentication status
    this.checkAuth();
  }
  
  initComponents() {
    // Initialize navbar
    this.components.navbar = new Navbar('navbar-container', {
      showEditorActions: this.options.showEditorActions
    });
    
    // Initialize sidebar if enabled
    if (this.options.showSidebar && this.elements.sidebarContainer) {
      this.components.sidebar = new Sidebar('sidebar-container', {
        defaultActive: this.options.activeMenuItem,
        sections: this.options.sidebarSections
      });
    }
  }
  
  checkAuth() {
    // Check if authentication is required
    const isAuthenticated = window.authManager && window.authManager.isAuthenticated();
    
    // If not authenticated and not on public pages, redirect to login
    if (!isAuthenticated) {
      const publicPages = ['/login.html', '/landing.html', '/index.html', '/', '/public/'];
      const currentPath = window.location.pathname;
      
      // Add logging to debug the path matching
      console.log('Current path:', currentPath);
      
      // Check if current path is a public page
      const isPublicPage = publicPages.some(page => 
        currentPath.endsWith(page) || 
        currentPath === '/' || 
        currentPath.includes('landing')
      );
      
      // Only redirect if not on a public page
      if (!isPublicPage) {
        window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }
  
  setContent(content) {
    if (this.elements.contentContainer) {
      this.elements.contentContainer.innerHTML = content;
    }
  }
  
  appendContent(content) {
    if (this.elements.contentContainer) {
      this.elements.contentContainer.insertAdjacentHTML('beforeend', content);
    }
  }
  
  setActiveMenuItem(itemId) {
    if (this.components.sidebar) {
      this.components.sidebar.setActive(itemId);
    }
  }
  
  refresh() {
    // Refresh all components
    if (this.components.navbar) {
      this.components.navbar.updateAuthState();
    }
    
    if (this.components.sidebar) {
      this.components.sidebar.render();
      this.components.sidebar.setupEventListeners();
    }
  }
}

// Export the component
window.AppLayout = AppLayout; 