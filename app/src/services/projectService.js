import api from './api';

/**
 * Fetch all projects for the authenticated user
 * @returns {Promise<Array>} - Array of project objects
 */
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch projects. Please try again.'
    );
  }
};

/**
 * Fetch a single project by ID
 * @param {string} projectId - The ID of the project to fetch
 * @returns {Promise<Object>} - Project object
 */
export const getProject = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch project. Please try again.'
    );
  }
};

/**
 * Create a new project
 * @param {Object} projectData - The project data to create
 * @returns {Promise<Object>} - Created project object
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to create project. Please try again.'
    );
  }
};

/**
 * Update an existing project
 * @param {string} projectId - The ID of the project to update
 * @param {Object} projectData - The updated project data
 * @returns {Promise<Object>} - Updated project object
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to update project. Please try again.'
    );
  }
};

/**
 * Delete a project
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to delete project. Please try again.'
    );
  }
};

/**
 * Fetch all available templates
 * @returns {Promise<Array>} - Array of template objects
 */
export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch templates. Please try again.'
    );
  }
};

/**
 * Fetch a single template by ID
 * @param {string} templateId - The ID of the template to fetch
 * @returns {Promise<Object>} - Template object
 */
export const getTemplate = async (templateId) => {
  try {
    const response = await api.get(`/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching template with ID ${templateId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch template. Please try again.'
    );
  }
};

/**
 * Create a new project from a template
 * @param {string} templateId - The ID of the template to use
 * @param {Object} projectData - Project metadata (name, description, etc.)
 * @returns {Promise<Object>} - Created project object
 */
export const createProjectFromTemplate = async (templateId, projectData) => {
  try {
    const response = await api.post(`/templates/${templateId}/create`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error creating project from template ${templateId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to create project from template. Please try again.'
    );
  }
};

/**
 * Publish a project (set it to live status)
 * @param {string} projectId - The ID of the project to publish
 * @returns {Promise<Object>} - Published project object
 */
export const publishProject = async (projectId) => {
  try {
    const response = await api.post(`/projects/${projectId}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to publish project. Please try again.'
    );
  }
};

/**
 * Unpublish a project (set it to draft status)
 * @param {string} projectId - The ID of the project to unpublish
 * @returns {Promise<Object>} - Unpublished project object
 */
export const unpublishProject = async (projectId) => {
  try {
    const response = await api.post(`/projects/${projectId}/unpublish`);
    return response.data;
  } catch (error) {
    console.error(`Error unpublishing project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to unpublish project. Please try again.'
    );
  }
};

/**
 * Deploy a project to the live server
 * @param {string} projectId - The ID of the project to deploy
 * @returns {Promise<Object>} - Deployment status and details
 */
export const deployProject = async (projectId) => {
  try {
    const response = await api.post(`/projects/${projectId}/deploy`);
    return response.data;
  } catch (error) {
    console.error(`Error deploying project with ID ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to deploy project. Please try again.'
    );
  }
};

/**
 * Get deployment history for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Array>} - Array of deployment objects
 */
export const getDeploymentHistory = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/deployments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching deployment history for project ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch deployment history. Please try again.'
    );
  }
};

/**
 * Get a signed URL for uploading a project image
 * @param {string} projectId - The ID of the project
 * @param {string} fileName - The name of the file to upload
 * @param {string} fileType - The MIME type of the file
 * @returns {Promise<Object>} - Object containing the signed URL
 */
export const getImageUploadUrl = async (projectId, fileName, fileType) => {
  try {
    const response = await api.post(`/projects/${projectId}/image-upload`, {
      fileName,
      fileType
    });
    return response.data;
  } catch (error) {
    console.error('Error getting image upload URL:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to get image upload URL. Please try again.'
    );
  }
};

/**
 * Save HTML content for a project
 * @param {string} projectId - The ID of the project
 * @param {string} html - The HTML content to save
 * @param {string} css - The CSS content to save
 * @param {string} js - Optional JavaScript content to save
 * @returns {Promise<Object>} - Updated project object
 */
export const saveProjectContent = async (projectId, html, css, js = '') => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  
  try {
    // Log content length for debugging
    const contentSize = (html?.length || 0) + (css?.length || 0) + (js?.length || 0);
    console.log(`Saving project ${projectId} content (${contentSize} bytes)`);
    
    // Create the request payload
    const payload = { 
      html: html || '',
      css: css || ''
    };
    
    // Add JavaScript only if provided
    if (js) {
      payload.js = js;
    }
    
    // Make the API request with timeout handling
    const response = await api.put(
      `/projects/${projectId}/content`, 
      payload,
      { 
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Return the server response
    return response.data;
  } catch (error) {
    console.error(`Error saving content for project ${projectId}:`, error);
    
    // Provide detailed error message
    if (error.response) {
      // Server responded with an error status
      throw new Error(
        error.response.data?.message || 
        `Server error: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        'Unable to connect to the server. Please check your internet connection.'
      );
    } else {
      // Error setting up the request
      throw new Error(
        error.message || 'Failed to save project content. Please try again.'
      );
    }
  }
};

/**
 * Get project analytics
 * @param {string} projectId - The ID of the project
 * @param {string} period - The time period for analytics (day, week, month, year)
 * @returns {Promise<Object>} - Analytics data object
 */
export const getProjectAnalytics = async (projectId, period = 'month') => {
  try {
    const response = await api.get(`/projects/${projectId}/analytics`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for project ${projectId}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch analytics. Please try again.'
    );
  }
}; 