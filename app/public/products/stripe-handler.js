// NOTE: This is a front-end implementation that simulates a Stripe checkout
// without requiring a backend server. In a real production environment,
// you should implement a proper backend to securely handle Stripe API calls.

// Handles the Stripe checkout process
class StripeHandler {
  constructor() {
    // Fallback function for direct download (used in demo mode)
    this.downloadCalculator = function() {
      // Create a blob with the calculator HTML content
      const originalHtml = document.documentElement.outerHTML;
      
      // Parse the HTML to create a clean version
      const parser = new DOMParser();
      const doc = parser.parseFromString(originalHtml, 'text/html');
      
      // Remove purchase-related elements
      const purchaseContainer = doc.querySelector('.purchase-container');
      if (purchaseContainer) {
        purchaseContainer.parentNode.removeChild(purchaseContainer);
      }
      
      // Remove Stripe script tag
      const stripeScript = doc.querySelector('script[src*="stripe.com"]');
      if (stripeScript) {
        stripeScript.parentNode.removeChild(stripeScript);
      }
      
      // Remove this script
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.textContent.includes('StripeHandler') || 
            script.textContent.includes('stripe') || 
            script.src.includes('stripe-handler.js')) {
          script.parentNode.removeChild(script);
        }
      });
      
      // Create the downloadable file blob
      const cleanHtml = new XMLSerializer().serializeToString(doc);
      const blob = new Blob([cleanHtml], { type: 'text/html' });
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'calc.html';
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Show success message
      alert('Thank you for your purchase! Your calculator is now downloading.');
    };
  }
  
  // Initialize the checkout button
  initCheckout(buttonId, options) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    button.addEventListener('click', () => {
      // In a real implementation, this would call your server endpoint
      // to create a Stripe checkout session
      
      // For demo/development, simply offer the direct download
      if (confirm('This is a demo. In a real implementation, you would be redirected to Stripe for payment. Would you like to download the calculator directly?')) {
        this.downloadCalculator();
      }
    });
  }
}

// Export the handler
window.StripeHandler = StripeHandler;