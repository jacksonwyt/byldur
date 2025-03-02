import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import EditorHeader from '../navigation/EditorHeader';
import EditorTools from '../editor/EditorTools';
import AIAssistantPanel from '../editor/AIAssistantPanel';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--editor-bg-color);
  color: var(--editor-text-color);
`;

const EditorArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainEditorSpace = styled.main`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const SidePanel = styled.aside`
  width: ${props => props.open ? '350px' : '0'};
  height: 100%;
  overflow-y: auto;
  background-color: var(--panel-bg-color);
  border-left: ${props => props.open ? '1px solid var(--border-color)' : 'none'};
  transition: width 0.3s ease;
`;

const EditorLayout = () => {
  const { darkMode } = useTheme();
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  
  const toggleAIPanel = () => {
    setAiPanelOpen(!aiPanelOpen);
  };

  return (
    <EditorContainer className={darkMode ? 'dark-mode' : ''}>
      <EditorHeader toggleAIPanel={toggleAIPanel} aiPanelOpen={aiPanelOpen} />
      <EditorArea>
        <EditorTools />
        <MainEditorSpace>
          <Outlet />
        </MainEditorSpace>
        <SidePanel open={aiPanelOpen}>
          <AIAssistantPanel />
        </SidePanel>
      </EditorArea>
    </EditorContainer>
  );
};

export default EditorLayout; 