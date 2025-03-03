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
  const { user } = useAuthApi();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { editor, html, css, js } = useEditor();
  const { updateProject, publishProject } = useProjectApi();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notification, setNotification] = useState(null);
  const uploadInputRef = useRef(null);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Handle save project
  const handleSave = async () => {
    if (!editor || !projectId) return;
    
    setIsSaving(true);
    
    try {
      // Start timing the save
      const startTime = performance.now();
      
      // Get project data
      const html = editor.getHtml();
      const css = editor.getCss();
      const js = editor.getJs();
      
      // Save the project
      await updateProject(projectId, { html, css, js });
      
      // Calculate save time
      const saveTime = Math.round(performance.now() - startTime);
      
      showNotification('Project saved successfully');
    } catch (error) {
      console.error('Failed to save project:', error);
      showNotification('Failed to save project. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      visible: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Handle preview
  const handlePreview = () => {
    if (!projectId) return;
    
    window.open(`/preview/${projectId}`, '_blank');
  };
  
  // Handle publish
  const handlePublish = async () => {
    if (!editor || !projectId) return;
    
    setIsPublishing(true);
    
    try {
      await publishProject(projectId, true);
      showNotification('Project published successfully!');
    } catch (error) {
      console.error('Failed to publish project:', error);
      showNotification('Failed to publish project. Please try again.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Handle GitHub sync
  const handleGitHubSync = () => {
    // Implementation will be added later
    showNotification('GitHub sync will be available soon!', 'info');
  };
  
  // Handle download project
  const handleDownload = () => {
    if (!editor || !projectId) return;
    
    // Export project as zip
    // Implementation will be added
    showNotification('Download feature will be available soon!', 'info');
  };
  
  // Handle upload project
  const handleUpload = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };
  
  return (
    <HeaderContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Brand to="/dashboard">
          <img src="/assets/byldur-logo.svg" alt="Byldur" />
          <span>Byldur</span>
        </Brand>
        
        {projectId && (
          <>
            <BackToDashboard to="/dashboard">
              <FaChevronLeft /> Back to Dashboard
            </BackToDashboard>
            <ProjectName>
              {projectId}
            </ProjectName>
          </>
        )}
      </div>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        {showMobileMenu ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      
      <Actions mobileMenuOpen={showMobileMenu}>
        <ActionButton 
          primary 
          onClick={handleSave} 
          disabled={isSaving}
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
      
      {notification && (
        <Notification visible={!!notification}>
          <FaCheckCircle />
          {notification.message}
        </Notification>
      )}
    </HeaderContainer>
  );
};

export default EditorHeader; 