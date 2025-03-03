import React, { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaSave, FaEye, FaGlobe, FaGithub, FaMagic, 
  FaDownload, FaUpload, FaHome, FaBars, FaTimes,
  FaChevronLeft, FaCog, FaCheckCircle 
} from 'react-icons/fa';
import useAuthApi from '../../hooks/useAuthApi';
import useProjectApi from '../../hooks/useProjectApi';
import { useTheme } from '../../hooks/useTheme';
import { useEditor } from '../../hooks/useEditor';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Button } from '../ui';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--editor-navbar-bg);
  color: var(--editor-navbar-text);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--editor-navbar-text);
  
  img {
    height: 30px;
  }
  
  span {
    font-weight: 600;
    font-size: 1.2rem;
    
    @media (max-width: 576px) {
      display: none;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: ${props => props.mobileMenuOpen ? 'flex' : 'none'};
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--editor-navbar-bg);
    padding: 1rem;
    z-index: 99;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
  
  span {
    @media (max-width: 992px) and (min-width: 769px) {
      display: none;
    }
    
    @media (max-width: 768px) {
      display: inline;
    }
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: var(--editor-navbar-text);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const BackToDashboard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--editor-navbar-text);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  color: var(--editor-navbar-text);
  font-weight: 500;
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: var(--shadow-md);
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? '0' : '20px'});
  transition: opacity 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-success);
  color: white;
`;

const EditorHeader = ({ toggleAIPanel, aiPanelOpen }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthApi();
  const { currentProject, publishProject, saveProjectContent } = useProjectApi();
  const { darkMode } = useTheme();
  const { 
    editor,
    isDirty,
    saveCurrentState,
    getHtmlContent,
    getCssContent
  } = useEditor();
  const analytics = useAnalytics();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Handle save project
  const handleSave = async () => {
    if (!projectId || !isAuthenticated || !editor) return;
    
    setIsSaving(true);
    showNotification('Saving project...');
    
    try {
      // Get content from editor
      const html = getHtmlContent();
      const css = getCssContent();
      
      // Track save start time for performance timing
      const startTime = performance.now();
      
      // Save to backend
      await saveProjectContent(projectId, html, css);
      
      // Track content save success
      const saveTime = performance.now() - startTime;
      analytics.trackContentSaved(projectId, { contentSize: (html?.length || 0) + (css?.length || 0) });
      analytics.trackTiming('content_save', saveTime, { projectId });
      
      // Update editor state
      await saveCurrentState();
      
      showNotification('Project saved successfully');
    } catch (error) {
      console.error('Failed to save project:', error);
      
      // Track error
      analytics.trackError('project_save', `Failed to save project: ${error.message || 'Unknown error'}`);
      
      showNotification('Error saving project: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show notification
  const showNotification = (message) => {
    setNotification({
      visible: true,
      message
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Handle preview
  const handlePreview = () => {
    if (!projectId) return;
    
    // Track preview action
    analytics.trackFeatureUsage('project_preview', 'opened', projectId);
    
    // First save the project if needed
    if (isDirty) {
      handleSave();
    }
    
    // Then open preview in new tab
    window.open(`/preview/${projectId}`, '_blank');
  };
  
  // Handle publish
  const handlePublish = async () => {
    if (!projectId || !isAuthenticated) return;
    
    try {
      // First save the project if needed
      if (isDirty) {
        await handleSave();
      }
      
      // Then publish
      await publishProject(projectId);
      
      // Track publish action
      analytics.trackProjectPublished(projectId);
      
      showNotification('Project published successfully');
    } catch (error) {
      console.error('Failed to publish project:', error);
      
      // Track error
      analytics.trackError('project_publish', `Failed to publish project: ${error.message || 'Unknown error'}`);
      
      showNotification('Error publishing project: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Handle GitHub sync
  const handleGitHubSync = () => {
    // Track GitHub sync attempt
    analytics.trackFeatureUsage('github_sync', 'attempted', projectId);
    
    // Implement GitHub sync functionality
    showNotification('GitHub integration coming soon');
  };
  
  // Handle download project
  const handleDownload = () => {
    if (!currentProject) return;
    
    // Track download action
    analytics.trackFeatureUsage('project_download', 'downloaded', projectId);
    
    // First save current changes if needed
    if (isDirty) {
      handleSave();
    }
    
    // Create a downloadable blob for the project content
    const fileContent = JSON.stringify({
      name: currentProject.name,
      description: currentProject.description,
      content: {
        html: getHtmlContent(),
        css: getCssContent()
      },
      createdAt: currentProject.createdAt,
      updatedAt: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    showNotification('Project downloaded successfully');
  };
  
  // Handle upload project
  const handleUpload = () => {
    // Track upload attempt
    analytics.trackFeatureUsage('project_upload', 'attempted', projectId);
    
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    // Handle file selection
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const projectData = JSON.parse(event.target.result);
          
          // Validate the imported data
          if (!projectData.content || (!projectData.content.html && !projectData.content.css)) {
            showNotification('Invalid project file format');
            return;
          }
          
          // Update the current project with the imported content
          // This would require additional implementation to apply the imported content
          showNotification('Project import feature coming soon');
        } catch (error) {
          console.error('Error parsing project file:', error);
          showNotification('Error importing project: Invalid file format');
        }
      };
      
      reader.readAsText(file);
    };
    
    // Trigger file selection dialog
    fileInput.click();
  };
  
  return (
    <HeaderContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Brand to="/dashboard">
          <img src="/assets/byldur-logo.svg" alt="Byldur" />
          <span>Byldur</span>
        </Brand>
        
        {projectId && currentProject && (
          <>
            <BackToDashboard to="/dashboard">
              <FaChevronLeft /> Back to Dashboard
            </BackToDashboard>
            <ProjectName>
              {currentProject.name || 'Untitled Project'}
              {isDirty && ' *'}
            </ProjectName>
          </>
        )}
      </div>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      
      <Actions mobileMenuOpen={mobileMenuOpen}>
        <ActionButton 
          primary 
          onClick={handleSave} 
          disabled={isSaving || !isDirty}
        >
          {isSaving ? 'Saving...' : (
            <>
              <FaSave /> <span>Save</span>
            </>
          )}
        </ActionButton>
        
        <ActionButton variant="outline" onClick={handlePreview}>
          <FaEye /> <span>Preview</span>
        </ActionButton>
        
        <ActionButton variant="success" onClick={handlePublish}>
          <FaGlobe /> <span>Publish</span>
        </ActionButton>
        
        <ActionButton variant="outline" onClick={handleGitHubSync}>
          <FaGithub /> <span>GitHub</span>
        </ActionButton>
        
        <ActionButton 
          variant={aiPanelOpen ? "primary" : "outline"} 
          onClick={toggleAIPanel}
        >
          <FaMagic /> <span>AI Assist</span>
        </ActionButton>
        
        <ActionButton variant="outline" onClick={handleDownload}>
          <FaDownload /> <span>Export</span>
        </ActionButton>
        
        <ActionButton variant="outline" onClick={handleUpload}>
          <FaUpload /> <span>Import</span>
        </ActionButton>
        
        <ActionButton variant="outline" as={Link} to="/dashboard">
          <FaHome /> <span>Dashboard</span>
        </ActionButton>
      </Actions>
      
      <Notification visible={notification.visible}>
        <FaCheckCircle />
        {notification.message}
      </Notification>
    </HeaderContainer>
  );
};

export default EditorHeader; 