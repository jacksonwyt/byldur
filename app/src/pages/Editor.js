import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProjects } from '../hooks/useProjects';
import EditorCanvas from '../components/editor/EditorCanvas';
import EditorHeader from '../components/navigation/EditorHeader';
import EditorTools from '../components/editor/EditorTools';
import AIAssistantPanel from '../components/editor/AIAssistantPanel';
import Spinner from '../components/common/Spinner';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ErrorMessage = styled.div`
  background-color: var(--color-error-bg);
  color: var(--color-error);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border-left: 4px solid var(--color-error);
  
  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0.5rem 0;
  }
  
  button {
    margin-top: 1rem;
  }
`;

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProject, currentProject, loading, error } = useProjects();
  const [editorReady, setEditorReady] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);
  
  useEffect(() => {
    // Set document title based on project name
    if (currentProject) {
      document.title = `Editing: ${currentProject.name} | Byldur`;
    } else {
      document.title = 'Website Editor | Byldur';
    }
    
    return () => {
      document.title = 'Byldur';
    };
  }, [currentProject]);
  
  const handleEditorReady = () => {
    setEditorReady(true);
  };
  
  const toggleAIPanel = () => {
    setAiPanelOpen(!aiPanelOpen);
  };
  
  // Show loading spinner while project is being fetched
  if (loading) {
    return (
      <LoadingContainer>
        <Spinner size="large" />
        <p>Loading project...</p>
      </LoadingContainer>
    );
  }
  
  // Show error message if project couldn't be loaded
  if (error) {
    return (
      <LoadingContainer>
        <ErrorMessage>
          <h3>Error Loading Project</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </ErrorMessage>
      </LoadingContainer>
    );
  }
  
  // Show error if project wasn't found
  if (!loading && !currentProject && projectId) {
    return (
      <LoadingContainer>
        <ErrorMessage>
          <h3>Project Not Found</h3>
          <p>The project you're trying to access doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </ErrorMessage>
      </LoadingContainer>
    );
  }
  
  return (
    <EditorContainer>
      <EditorHeader 
        toggleAIPanel={toggleAIPanel}
        aiPanelOpen={aiPanelOpen}
      />
      
      <EditorContent>
        <EditorTools />
        
        <CanvasContainer>
          <EditorCanvas 
            ref={canvasRef}
            onReady={handleEditorReady}
          />
        </CanvasContainer>
        
        {aiPanelOpen && (
          <AIAssistantPanel 
            onClose={() => setAiPanelOpen(false)} 
          />
        )}
      </EditorContent>
    </EditorContainer>
  );
};

export default Editor; 