/**
 * AI Editor Integration for Byldur Website Builder
 * This script adds AI functionality to the GrapesJS editor
 */

class AIEditorIntegration {
  constructor(editor) {
    this.editor = editor;
    this.aiPanelContainer = null;
    this.isSubscriptionChecked = false;
    this.hasActiveSubscription = false;
    this.aiCredits = 0;
    
    this.init();
  }
  
  /**
   * Initialize the AI integration
   */
  async init() {
    // Check subscription status first
    await this.checkSubscription();
    
    // Add AI panel to editor
    this.addAIPanel();
    
    // Add AI commands to editor
    this.addAICommands();
  }
  
  /**
   * Check if user has active AI subscription
   */
  async checkSubscription() {
    try {
      const response = await fetch('/api/ai/usage', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isSubscriptionChecked = true;
        this.hasActiveSubscription = data.subscription.status === 'active' && data.subscription.type !== 'free';
        this.aiCredits = data.aiUsage.credits;
        this.subscriptionData = data;
      } else {
        // If 401, user is not logged in
        if (response.status === 401) {
          console.warn('User not authenticated for AI features');
        } else {
          console.error('Failed to check AI subscription:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error checking AI subscription:', error);
    }
  }
  
  /**
   * Add AI panel to editor
   */
  addAIPanel() {
    // Add panel button to the right sidebar
    this.editor.Panels.addButton('views', {
      id: 'ai-panel',
      className: 'fa fa-magic',
      command: 'open-ai-panel',
      attributes: { title: 'AI Assistant' }
    });
    
    // Create panel container
    this.aiPanelContainer = document.createElement('div');
    this.aiPanelContainer.className = 'ai-panel-container';
    
    // Add panel to editor
    this.editor.Commands.add('open-ai-panel', {
      run: (editor, sender) => {
        // Toggle button active state
        sender.set('active', true);
        
        // Show panel
        this.showAIPanel();
      },
      stop: (editor, sender) => {
        // Toggle button active state
        sender.set('active', false);
        
        // Hide panel
        this.hideAIPanel();
      }
    });
    
    // Add panel container to editor
    document.body.appendChild(this.aiPanelContainer);
  }
  
  /**
   * Show AI panel
   */
  showAIPanel() {
    // Update panel content
    this.updateAIPanelContent();
    
    // Show panel
    this.aiPanelContainer.style.display = 'block';
    
    // Add animation class
    setTimeout(() => {
      this.aiPanelContainer.classList.add('show');
    }, 10);
  }
  
  /**
   * Hide AI panel
   */
  hideAIPanel() {
    // Remove animation class
    this.aiPanelContainer.classList.remove('show');
    
    // Hide panel after animation
    setTimeout(() => {
      this.aiPanelContainer.style.display = 'none';
    }, 300);
  }
  
  /**
   * Update AI panel content
   */
  updateAIPanelContent() {
    if (!this.isSubscriptionChecked) {
      this.aiPanelContainer.innerHTML = `
        <div class="ai-panel-header">
          <h3>AI Assistant</h3>
          <span class="close-ai-panel">&times;</span>
        </div>
        <div class="ai-panel-content">
          <div class="ai-loading">
            <div class="spinner"></div>
            <p>Checking subscription status...</p>
          </div>
        </div>
      `;
      
      // Add close button event
      this.aiPanelContainer.querySelector('.close-ai-panel').addEventListener('click', () => {
        this.editor.runCommand('open-ai-panel');
      });
      
      return;
    }
    
    if (!this.hasActiveSubscription && this.aiCredits === 0) {
      // No subscription and no credits
      this.aiPanelContainer.innerHTML = `
        <div class="ai-panel-header">
          <h3>AI Assistant</h3>
          <span class="close-ai-panel">&times;</span>
        </div>
        <div class="ai-panel-content">
          <div class="ai-subscription-required">
            <i class="fas fa-lock"></i>
            <h4>AI Features Locked</h4>
            <p>Subscribe to our AI plan to unlock Claude AI assistance for your website building.</p>
            <a href="/subscription.html" class="ai-subscribe-btn">View AI Plans</a>
          </div>
        </div>
      `;
    } else {
      // Has subscription or credits
      let subscriptionStatus = '';
      
      if (this.hasActiveSubscription) {
        const plan = this.subscriptionData.subscription.type;
        subscriptionStatus = `
          <div class="ai-status-badge active">
            <i class="fas fa-check-circle"></i> ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Active
          </div>
        `;
      } else if (this.aiCredits > 0) {
        subscriptionStatus = `
          <div class="ai-status-badge credits">
            <i class="fas fa-coins"></i> ${this.aiCredits} AI Credits Available
          </div>
        `;
      }
      
      this.aiPanelContainer.innerHTML = `
        <div class="ai-panel-header">
          <h3>AI Assistant</h3>
          <span class="close-ai-panel">&times;</span>
        </div>
        <div class="ai-panel-status">
          ${subscriptionStatus}
        </div>
        <div class="ai-panel-content">
          <div class="ai-actions">
            <div class="ai-action-group">
              <h4>Generate Components</h4>
              <div class="ai-action-buttons">
                <button class="ai-action-btn" data-action="generate-header">
                  <i class="fas fa-heading"></i> Header
                </button>
                <button class="ai-action-btn" data-action="generate-hero">
                  <i class="fas fa-image"></i> Hero
                </button>
                <button class="ai-action-btn" data-action="generate-features">
                  <i class="fas fa-list"></i> Features
                </button>
                <button class="ai-action-btn" data-action="generate-contact">
                  <i class="fas fa-envelope"></i> Contact
                </button>
                <button class="ai-action-btn" data-action="generate-footer">
                  <i class="fas fa-ellipsis-h"></i> Footer
                </button>
              </div>
            </div>
            
            <div class="ai-action-group">
              <h4>Custom Generation</h4>
              <div class="ai-custom-prompt">
                <textarea id="ai-prompt" placeholder="Describe what you want to generate..."></textarea>
                <button class="ai-generate-btn" id="ai-generate-custom">Generate</button>
              </div>
            </div>
            
            <div class="ai-action-group">
              <h4>Improve Selected Component</h4>
              <button class="ai-improve-btn" id="ai-improve-component">
                <i class="fas fa-magic"></i> Improve Design
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners
      this.addAIPanelEventListeners();
    }
    
    // Add close button event
    this.aiPanelContainer.querySelector('.close-ai-panel').addEventListener('click', () => {
      this.editor.runCommand('open-ai-panel');
    });
  }
  
  /**
   * Add event listeners to AI panel
   */
  addAIPanelEventListeners() {
    // Predefined component buttons
    this.aiPanelContainer.querySelectorAll('.ai-action-btn').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.generatePredefinedComponent(action);
      });
    });
    
    // Custom generation button
    const generateCustomBtn = this.aiPanelContainer.querySelector('#ai-generate-custom');
    if (generateCustomBtn) {
      generateCustomBtn.addEventListener('click', () => {
        const prompt = this.aiPanelContainer.querySelector('#ai-prompt').value;
        if (prompt.trim()) {
          this.generateCustomComponent(prompt);
        } else {
          alert('Please enter a description of what you want to generate.');
        }
      });
    }
    
    // Improve component button
    const improveBtn = this.aiPanelContainer.querySelector('#ai-improve-component');
    if (improveBtn) {
      improveBtn.addEventListener('click', () => {
        this.improveSelectedComponent();
      });
    }
  }
  
  /**
   * Add AI commands to editor
   */
  addAICommands() {
    // Add command to generate component
    this.editor.Commands.add('ai-generate-component', {
      run: (editor, sender, options) => {
        this.generateComponent(options);
      }
    });
    
    // Add command to improve component
    this.editor.Commands.add('ai-improve-component', {
      run: (editor, sender, options) => {
        this.improveComponent(options);
      }
    });
  }
  
  /**
   * Generate a predefined component
   * @param {string} type - Component type
   */
  generatePredefinedComponent(type) {
    let description = '';
    
    switch (type) {
      case 'generate-header':
        description = 'Create a modern responsive navigation header with logo, menu items, and a call-to-action button';
        break;
      case 'generate-hero':
        description = 'Create a hero section with a compelling headline, subheading, a call-to-action button, and a background image';
        break;
      case 'generate-features':
        description = 'Create a features section with 3 columns, each with an icon, heading, and description';
        break;
      case 'generate-contact':
        description = 'Create a contact form with name, email, message fields and a submit button';
        break;
      case 'generate-footer':
        description = 'Create a footer with logo, copyright information, social media links, and site navigation';
        break;
      default:
        alert('Unknown component type');
        return;
    }
    
    this.generateCustomComponent(description);
  }
  
  /**
   * Generate a custom component
   * @param {string} description - Component description
   */
  async generateCustomComponent(description) {
    if (!this.hasActiveSubscription && this.aiCredits === 0) {
      alert('You need an active AI subscription or credits to use this feature.');
      return;
    }
    
    // Show loading in the panel
    const contentArea = this.aiPanelContainer.querySelector('.ai-panel-content');
    const originalContent = contentArea.innerHTML;
    
    contentArea.innerHTML = `
      <div class="ai-loading">
        <div class="spinner"></div>
        <p>Generating your component...</p>
        <small>This may take a few seconds</small>
      </div>
    `;
    
    try {
      const response = await fetch('/api/ai/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update subscription status
        this.aiCredits = data.aiUsage.credits;
        
        // Add component to editor
        this.addGeneratedComponentToEditor(data.component);
        
        // Restore original content
        contentArea.innerHTML = originalContent;
        
        // Update status
        this.updateAIPanelContent();
        
        // Close panel
        this.editor.runCommand('open-ai-panel');
      } else {
        const errorData = await response.json();
        
        if (response.status === 402) {
          // Not enough credits
          alert('You have used all your AI credits. Please purchase more to continue using AI features.');
          window.location.href = '/subscription.html';
        } else {
          alert(errorData.error || 'Failed to generate component');
        }
        
        // Restore original content
        contentArea.innerHTML = originalContent;
      }
    } catch (error) {
      console.error('Error generating component:', error);
      alert('An error occurred while generating your component. Please try again.');
      
      // Restore original content
      contentArea.innerHTML = originalContent;
    }
  }
  
  /**
   * Add generated component to editor
   * @param {Object} component - Generated component
   */
  addGeneratedComponentToEditor(component) {
    // Get editor canvas
    const wrapper = this.editor.DomComponents.getWrapper();
    
    // Create style element for CSS
    if (component.css) {
      const cssComp = this.editor.DomComponents.addComponent({
        tagName: 'style',
        content: component.css,
        type: 'text'
      });
      
      // Add to head
      this.editor.getModel().get('Head').get('components').add(cssComp);
    }
    
    // Add HTML component
    if (component.html) {
      // Create temporary element to parse HTML
      const tempEl = document.createElement('div');
      tempEl.innerHTML = component.html;
      
      // Add each child as a component
      Array.from(tempEl.children).forEach(child => {
        const htmlComp = this.editor.DomComponents.addComponent({
          tagName: child.tagName.toLowerCase(),
          attributes: this.getElementAttributes(child),
          content: child.innerHTML,
          style: this.getInlineStyles(child)
        });
        
        wrapper.append(htmlComp);
      });
    }
    
    // Add JavaScript
    if (component.js) {
      // Add script tag to the page
      const scriptEl = document.createElement('script');
      scriptEl.textContent = component.js;
      document.body.appendChild(scriptEl);
    }
  }
  
  /**
   * Get element attributes
   * @param {Element} element - DOM element
   * @returns {Object} - Attributes object
   */
  getElementAttributes(element) {
    const attributes = {};
    
    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'style') {
        attributes[attr.name] = attr.value;
      }
    });
    
    return attributes;
  }
  
  /**
   * Get inline styles as object
   * @param {Element} element - DOM element
   * @returns {Object} - Style object
   */
  getInlineStyles(element) {
    const styles = {};
    
    if (element.style && element.style.cssText) {
      element.style.cssText.split(';').forEach(style => {
        if (style.trim()) {
          const [property, value] = style.split(':').map(s => s.trim());
          if (property && value) {
            // Convert kebab-case to camelCase
            const camelProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
            styles[camelProperty] = value;
          }
        }
      });
    }
    
    return styles;
  }
  
  /**
   * Improve selected component
   */
  async improveSelectedComponent() {
    if (!this.hasActiveSubscription && this.aiCredits === 0) {
      alert('You need an active AI subscription or credits to use this feature.');
      return;
    }
    
    // Get selected component
    const selected = this.editor.getSelected();
    
    if (!selected) {
      alert('Please select a component to improve');
      return;
    }
    
    // Show loading in the panel
    const contentArea = this.aiPanelContainer.querySelector('.ai-panel-content');
    const originalContent = contentArea.innerHTML;
    
    contentArea.innerHTML = `
      <div class="ai-loading">
        <div class="spinner"></div>
        <p>Improving your component...</p>
        <small>This may take a few seconds</small>
      </div>
    `;
    
    try {
      // Get component HTML, CSS and JS
      const html = selected.toHTML();
      let css = '';
      let js = '';
      
      // Get custom CSS for the component (if any)
      const componentCss = this.editor.CssComposer.getRule(selected.getClasses().join('.'));
      if (componentCss) {
        css = componentCss.toCSS();
      }
      
      // Send to API
      const response = await fetch('/api/ai/improve-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, css, js }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update subscription status
        this.aiCredits = data.aiUsage.credits;
        
        // Replace selected component with improved one
        this.replaceSelectedComponent(data.component);
        
        // Restore original content
        contentArea.innerHTML = originalContent;
        
        // Update status
        this.updateAIPanelContent();
        
        // Close panel
        this.editor.runCommand('open-ai-panel');
      } else {
        const errorData = await response.json();
        
        if (response.status === 402) {
          // Not enough credits
          alert('You have used all your AI credits. Please purchase more to continue using AI features.');
          window.location.href = '/subscription.html';
        } else {
          alert(errorData.error || 'Failed to improve component');
        }
        
        // Restore original content
        contentArea.innerHTML = originalContent;
      }
    } catch (error) {
      console.error('Error improving component:', error);
      alert('An error occurred while improving your component. Please try again.');
      
      // Restore original content
      contentArea.innerHTML = originalContent;
    }
  }
  
  /**
   * Replace selected component with improved one
   * @param {Object} component - Improved component
   */
  replaceSelectedComponent(component) {
    // Get selected component
    const selected = this.editor.getSelected();
    
    if (!selected) {
      return;
    }
    
    // Create temporary element to parse HTML
    const tempEl = document.createElement('div');
    tempEl.innerHTML = component.html;
    
    if (tempEl.children.length > 0) {
      const firstChild = tempEl.children[0];
      
      // Replace content
      selected.set('content', firstChild.innerHTML);
      
      // Replace attributes
      selected.set('attributes', this.getElementAttributes(firstChild));
      
      // Replace styles
      selected.set('style', this.getInlineStyles(firstChild));
    }
    
    // Add any new CSS
    if (component.css) {
      const cssComp = this.editor.DomComponents.addComponent({
        tagName: 'style',
        content: component.css,
        type: 'text'
      });
      
      this.editor.getModel().get('Head').get('components').add(cssComp);
    }
    
    // Add any new JavaScript
    if (component.js) {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = component.js;
      document.body.appendChild(scriptEl);
    }
  }
}

// Add AI panel styles
const style = document.createElement('style');
style.textContent = `
  .ai-panel-container {
    position: fixed;
    top: 50px;
    right: -300px;
    width: 300px;
    height: calc(100vh - 50px);
    background-color: white;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 100;
    transition: right 0.3s ease;
    display: none;
    overflow-y: auto;
  }
  
  .ai-panel-container.show {
    right: 0;
  }
  
  .ai-panel-header {
    padding: 15px;
    background-color: #333;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .ai-panel-header h3 {
    margin: 0;
  }
  
  .close-ai-panel {
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .ai-panel-status {
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
  }
  
  .ai-status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .ai-status-badge.active {
    background-color: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }
  
  .ai-status-badge.credits {
    background-color: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
  
  .ai-panel-content {
    padding: 15px;
  }
  
  .ai-loading {
    text-align: center;
    padding: 30px 0;
  }
  
  .ai-loading .spinner {
    border-top-color: #4a6cf7;
    margin-bottom: 15px;
  }
  
  .ai-subscription-required {
    text-align: center;
    padding: 30px 0;
  }
  
  .ai-subscription-required i {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 15px;
  }
  
  .ai-subscribe-btn {
    display: inline-block;
    padding: 8px 16px;
    background-color: #4a6cf7;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    margin-top: 15px;
    transition: background-color 0.2s;
  }
  
  .ai-subscribe-btn:hover {
    background-color: #3a5ce4;
  }
  
  .ai-action-group {
    margin-bottom: 20px;
  }
  
  .ai-action-group h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1rem;
  }
  
  .ai-action-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .ai-action-btn {
    padding: 8px 12px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  
  .ai-action-btn:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
  }
  
  .ai-custom-prompt {
    margin-top: 10px;
  }
  
  .ai-custom-prompt textarea {
    width: 100%;
    height: 100px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    margin-bottom: 10px;
  }
  
  .ai-generate-btn,
  .ai-improve-btn {
    width: 100%;
    padding: 10px;
    background-color: #4a6cf7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .ai-generate-btn:hover,
  .ai-improve-btn:hover {
    background-color: #3a5ce4;
  }
`;

document.head.appendChild(style);

// Initialize AI integration when editor is loaded
window.addEventListener('load', () => {
  // Wait for editor to be defined
  const checkEditor = setInterval(() => {
    if (window.editor) {
      clearInterval(checkEditor);
      window.aiEditor = new AIEditorIntegration(window.editor);
    }
  }, 100);
}); 