const axios = require('axios');

class ClaudeService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anthropic.com/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
  }

  /**
   * Generate a completion using Claude API
   * @param {string} prompt - The prompt to send to Claude
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - The Claude API response
   */
  async generateCompletion(prompt, options = {}) {
    try {
      const defaultOptions = {
        model: 'claude-3-opus-20240229',
        max_tokens_to_sample: 1000,
        temperature: 0.7,
        top_p: 0.9,
        stop_sequences: ["\n\nHuman:"]
      };

      const requestData = {
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        ...defaultOptions,
        ...options
      };

      const response = await this.client.post('/complete', requestData);
      return response.data;
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to generate completion');
    }
  }

  /**
   * Generate website components from a description
   * @param {string} description - Description of the desired component
   * @returns {Promise<Object>} - HTML, CSS, and JS for the component
   */
  async generateWebsiteComponent(description) {
    const prompt = `Generate a website component based on this description: "${description}".
    Please provide valid HTML, CSS, and JavaScript code for this component.
    Format your response as a JSON object with the following structure:
    {
      "html": "<!-- HTML code here -->",
      "css": "/* CSS code here */",
      "js": "// JavaScript code here"
    }
    The code should be clean, modern, responsive, and follow best practices. 
    Do not include any explanations, just the JSON object with the code.`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.5,
        max_tokens_to_sample: 2000
      });

      // Extract the JSON response
      const jsonStr = response.completion.trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error generating website component:', error);
      throw new Error('Failed to generate website component');
    }
  }

  /**
   * Improve existing website code
   * @param {Object} component - Object containing HTML, CSS, and JS
   * @returns {Promise<Object>} - Improved HTML, CSS, and JS
   */
  async improveWebsiteCode(component) {
    const prompt = `Improve the following website code:
    
    HTML:
    ${component.html}
    
    CSS:
    ${component.css}
    
    JavaScript:
    ${component.js}
    
    Please optimize this code for performance, responsiveness, and modern best practices.
    Format your response as a JSON object with the following structure:
    {
      "html": "<!-- Improved HTML code -->",
      "css": "/* Improved CSS code */",
      "js": "// Improved JavaScript code */"
    }
    Do not include any explanations, just the JSON object with the improved code.`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.3,
        max_tokens_to_sample: 2500
      });

      // Extract the JSON response
      const jsonStr = response.completion.trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error improving website code:', error);
      throw new Error('Failed to improve website code');
    }
  }

  /**
   * Generate a complete website template from a description
   * @param {string} description - Description of the desired website
   * @returns {Promise<Object>} - Complete website template
   */
  async generateWebsiteTemplate(description) {
    const prompt = `Create a complete website template based on this description: "${description}".
    The website should have a modern, responsive design and follow best practices.
    
    Please provide:
    1. HTML for the main page
    2. CSS for styling
    3. JavaScript for interactivity
    
    Format your response as a JSON object with the following structure:
    {
      "html": "<!-- Complete HTML document -->",
      "css": "/* Complete CSS stylesheet */",
      "js": "// Complete JavaScript code"
    }
    
    The code should be production-ready and include comments where necessary.
    Do not include any explanations outside the JSON object.`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.5,
        max_tokens_to_sample: 4000
      });

      // Extract the JSON response
      const jsonStr = response.completion.trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error generating website template:', error);
      throw new Error('Failed to generate website template');
    }
  }
}

module.exports = ClaudeService; 