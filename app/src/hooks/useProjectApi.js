import { useState, useCallback } from 'react';
import useApi from './useApi';

/**
 * Hook for interacting with project and template APIs
 * Uses the useApi hook for consistent API operations
 */
const useProjectApi = () => {
  const projectsApi = useApi('/api/projects');
  const templatesApi = useApi('/api/templates');
  
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  
  // ===== Project Operations ===== //
  
  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectsApi.get('');
      setProjects(data);
      return data;
    } catch (error) {
      // Error is handled by useApi
      return [];
    }
  }, [projectsApi]);
  
  // Fetch a single project
  const fetchProject = useCallback(async (projectId) => {
    if (!projectId) return null;
    
    try {
      const data = await projectsApi.get(`/${projectId}`);
      setCurrentProject(data);
      return data;
    } catch (error) {
      return null;
    }
  }, [projectsApi]);
  
  // Create a new project
  const createProject = useCallback(async (projectData) => {
    try {
      const newProject = await projectsApi.post('', projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (error) {
      return null;
    }
  }, [projectsApi]);
  
  // Update a project
  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      const updatedProject = await projectsApi.put(`/${projectId}`, projectData);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      return updatedProject;
    } catch (error) {
      return null;
    }
  }, [projectsApi, currentProject]);
  
  // Delete a project
  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectsApi.delete(`/${projectId}`);
      
      // Remove from projects array
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Clear current project if it was the deleted one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }, [projectsApi, currentProject]);
  
  // Publish a project
  const publishProject = useCallback(async (projectId) => {
    try {
      const publishedProject = await projectsApi.post(`/${projectId}/publish`);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? publishedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(publishedProject);
      }
      
      return publishedProject;
    } catch (error) {
      return null;
    }
  }, [projectsApi, currentProject]);
  
  // Unpublish a project
  const unpublishProject = useCallback(async (projectId) => {
    try {
      const unpublishedProject = await projectsApi.post(`/${projectId}/unpublish`);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? unpublishedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(unpublishedProject);
      }
      
      return unpublishedProject;
    } catch (error) {
      return null;
    }
  }, [projectsApi, currentProject]);
  
  // Deploy a project
  const deployProject = useCallback(async (projectId) => {
    try {
      const deployment = await projectsApi.post(`/${projectId}/deploy`);
      
      // Fetch updated project after deployment
      const updatedProject = await fetchProject(projectId);
      
      // Update deployments array
      setDeployments(prev => [deployment, ...prev]);
      
      return { project: updatedProject, deployment };
    } catch (error) {
      return null;
    }
  }, [projectsApi, fetchProject]);
  
  // Save project content
  const saveProjectContent = useCallback(async (projectId, html, css, js = '') => {
    setSaveStatus('saving');
    
    try {
      const payload = { 
        html: html || '',
        css: css || ''
      };
      
      // Add JavaScript only if provided
      if (js) {
        payload.js = js;
      }
      
      const updatedProject = await projectsApi.put(`/${projectId}/content`, payload);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000); // Reset status after 2 seconds
      return updatedProject;
    } catch (error) {
      setSaveStatus('error');
      return null;
    }
  }, [projectsApi, currentProject]);
  
  // Get deployment history
  const getDeploymentHistory = useCallback(async (projectId) => {
    try {
      const history = await projectsApi.get(`/${projectId}/deployments`);
      setDeployments(history);
      return history;
    } catch (error) {
      return [];
    }
  }, [projectsApi]);
  
  // Get image upload URL
  const getImageUploadUrl = useCallback(async (projectId, fileName, fileType) => {
    try {
      return await projectsApi.post(`/${projectId}/image-upload`, { fileName, fileType });
    } catch (error) {
      return null;
    }
  }, [projectsApi]);
  
  // Duplicate a project
  const duplicateProject = useCallback(async (projectId, newName = '') => {
    try {
      // First get the project to duplicate
      const sourceProject = await fetchProject(projectId);
      
      if (!sourceProject) {
        throw new Error('Project not found');
      }
      
      // Create a new project with the same data but a different name
      const newProjectData = {
        ...sourceProject,
        name: newName || `${sourceProject.name} (Copy)`,
        id: undefined,  // Remove ID so a new one will be generated
        createdAt: undefined,
        updatedAt: undefined
      };
      
      const newProject = await createProject(newProjectData);
      return newProject;
    } catch (error) {
      return null;
    }
  }, [fetchProject, createProject]);
  
  // Get project analytics
  const getProjectAnalytics = useCallback(async (projectId, period = 'month') => {
    try {
      return await projectsApi.get(`/${projectId}/analytics`, { period });
    } catch (error) {
      return null;
    }
  }, [projectsApi]);
  
  // ===== Template Operations ===== //
  
  // Fetch all templates
  const fetchTemplates = useCallback(async () => {
    try {
      const data = await templatesApi.get('');
      setTemplates(data);
      return data;
    } catch (error) {
      return [];
    }
  }, [templatesApi]);
  
  // Create project from template
  const createFromTemplate = useCallback(async (templateId, projectData) => {
    try {
      const newProject = await templatesApi.post(`/${templateId}/create`, projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (error) {
      return null;
    }
  }, [templatesApi]);
  
  // Get a single template
  const fetchTemplate = useCallback(async (templateId) => {
    try {
      return await templatesApi.get(`/${templateId}`);
    } catch (error) {
      return null;
    }
  }, [templatesApi]);
  
  // ===== Other Operations ===== //
  
  // Clear current project
  const clearCurrentProject = useCallback(() => {
    setCurrentProject(null);
  }, []);
  
  return {
    // State
    projects,
    currentProject,
    templates,
    deployments,
    loading: projectsApi.loading || templatesApi.loading,
    error: projectsApi.error || templatesApi.error,
    saveStatus,
    
    // Project methods
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    publishProject,
    unpublishProject,
    deployProject,
    saveProjectContent,
    getDeploymentHistory,
    getImageUploadUrl,
    duplicateProject,
    getProjectAnalytics,
    
    // Template methods
    fetchTemplates,
    createFromTemplate,
    fetchTemplate,
    
    // Utility methods
    clearCurrentProject,
    clearError: () => {
      projectsApi.clearError();
      templatesApi.clearError();
    }
  };
};

export default useProjectApi;