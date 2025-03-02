import React, { createContext, useState, useCallback, useEffect } from 'react';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject as apiDeleteProject,
  getTemplates,
  publishProject as apiPublishProject,
  unpublishProject as apiUnpublishProject,
  deployProject as apiDeployProject,
  getDeploymentHistory as apiGetDeploymentHistory,
  saveProjectContent as apiSaveProjectContent,
  getImageUploadUrl as apiGetImageUploadUrl,
  createProjectFromTemplate as apiCreateProjectFromTemplate
} from '../services/projectService';
import { useAuth } from '../hooks/useAuth';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setProjects([]);
      setCurrentProject(null);
      setTemplates([]);
      setDeployments([]);
    }
  }, [isAuthenticated]);

  // Fetch all projects for the authenticated user
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProjects();
      setProjects(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      console.error('Error fetching projects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch a single project by ID
  const fetchProject = useCallback(async (projectId) => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProject(projectId);
      setCurrentProject(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load project');
      console.error('Error fetching project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new project
  const addProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project from template
  const createFromTemplate = useCallback(async (templateId, projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await apiCreateProjectFromTemplate(templateId, projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project from template');
      console.error('Error creating project from template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicate a project
  const duplicateProject = useCallback(async (projectId, newName = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // First get the project to duplicate
      const sourceProject = await getProject(projectId);
      
      // Create a new project with the same data but a different name
      const newProjectData = {
        ...sourceProject,
        name: newName || `${sourceProject.name} (Copy)`,
        id: undefined,  // Remove ID so a new one will be generated
        createdAt: undefined,
        updatedAt: undefined
      };
      
      const newProject = await createProject(newProjectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to duplicate project');
      console.error('Error duplicating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing project
  const updateProjectData = useCallback(async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await updateProject(projectId, projectData);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      return updatedProject;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      console.error('Error updating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Save project content (HTML, CSS, JS)
  const saveProjectContent = useCallback(async (projectId, html, css, js = '') => {
    setSaveStatus('saving');
    
    try {
      const updatedProject = await apiSaveProjectContent(projectId, html, css, js);
      
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
    } catch (err) {
      setError(err.message || 'Failed to save project content');
      console.error('Error saving project content:', err);
      setSaveStatus('error');
      return null;
    }
  }, [currentProject]);

  // Get signed URL for image upload
  const getImageUploadUrl = useCallback(async (projectId, fileName, fileType) => {
    try {
      const response = await apiGetImageUploadUrl(projectId, fileName, fileType);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to get image upload URL');
      console.error('Error getting image upload URL:', err);
      return null;
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiDeleteProject(projectId);
      
      // Remove from projects array
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Clear current project if it was the deleted one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Publish a project
  const publishProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const publishedProject = await apiPublishProject(projectId);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? publishedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(publishedProject);
      }
      
      return publishedProject;
    } catch (err) {
      setError(err.message || 'Failed to publish project');
      console.error('Error publishing project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Unpublish a project
  const unpublishProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const unpublishedProject = await apiUnpublishProject(projectId);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? unpublishedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(unpublishedProject);
      }
      
      return unpublishedProject;
    } catch (err) {
      setError(err.message || 'Failed to unpublish project');
      console.error('Error unpublishing project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Deploy a project
  const deployProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const deployment = await apiDeployProject(projectId);
      
      // Fetch updated project after deployment
      const updatedProject = await getProject(projectId);
      
      // Update projects array
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      // Update current project if it's the active one
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      // Update deployments array
      setDeployments(prev => [deployment, ...prev]);
      
      return { project: updatedProject, deployment };
    } catch (err) {
      setError(err.message || 'Failed to deploy project');
      console.error('Error deploying project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Get deployment history for a project
  const getDeploymentHistory = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const history = await apiGetDeploymentHistory(projectId);
      setDeployments(history);
      return history;
    } catch (err) {
      setError(err.message || 'Failed to fetch deployment history');
      console.error('Error fetching deployment history:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all available templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTemplates();
      setTemplates(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      console.error('Error fetching templates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear the currently selected project
  const clearCurrentProject = useCallback(() => {
    setCurrentProject(null);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        templates,
        deployments,
        loading,
        error,
        saveStatus,
        fetchProjects,
        fetchProject,
        addProject,
        createFromTemplate,
        duplicateProject,
        updateProject: updateProjectData,
        saveProjectContent,
        getImageUploadUrl,
        deleteProject,
        publishProject,
        unpublishProject,
        deployProject,
        getDeploymentHistory,
        fetchTemplates,
        clearCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider; 