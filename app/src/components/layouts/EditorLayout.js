import React, { useState } from 'react';
import BaseLayout from './BaseLayout';
import EditorHeader from '../navigation/EditorHeader';
import EditorTools from '../editor/EditorTools';
import AIAssistantPanel from '../editor/AIAssistantPanel';

const EditorLayout = () => {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  
  const toggleAIPanel = () => {
    setAiPanelOpen(!aiPanelOpen);
  };

  return (
    <BaseLayout 
      layout="editor"
      header={<EditorHeader toggleAIPanel={toggleAIPanel} aiPanelOpen={aiPanelOpen} />}
      sidePanel={<AIAssistantPanel />}
      sidePanelOpen={aiPanelOpen}
      noPadding={true}
      showFooter={false}
      children={<EditorTools />}
    />
  );
};

export default EditorLayout;