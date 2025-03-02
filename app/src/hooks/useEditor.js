import { useState, useContext, createContext } from 'react';

// Create Editor context
const EditorContext = createContext();

// Provider component
export const EditorProvider = ({ children }) => {
  const [editor, setEditor] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');

  // Register editor instance
  const registerEditor = (editorInstance) => {
    setEditor(editorInstance);
    
    // Set up event listeners
    if (editorInstance) {
      // Listen for component selection
      editorInstance.on('component:selected', (component) => {
        setSelectedComponent(component);
      });
      
      // Listen for component deselection
      editorInstance.on('component:deselected', () => {
        setSelectedComponent(null);
      });
      
      // Listen for changes
      editorInstance.on('change:changesCount', () => {
        setIsDirty(editorInstance.getDirtyCount() > 0);
      });
    }
  };

  // Save current state
  const saveCurrentState = async () => {
    if (!editor) return false;
    
    try {
      // Reset dirty count
      editor.editor.setDirtyCount(0);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Error saving editor state:', error);
      return false;
    }
  };

  // Change view mode
  const changeViewMode = (mode) => {
    setViewMode(mode);
    
    if (editor) {
      switch (mode) {
        case 'desktop':
          editor.setDevice('Desktop');
          break;
        case 'tablet':
          editor.setDevice('Tablet');
          break;
        case 'mobile':
          editor.setDevice('Mobile');
          break;
        default:
          break;
      }
    }
  };

  // Get HTML content
  const getHtmlContent = () => {
    if (!editor) return '';
    return editor.getHtml();
  };

  // Get CSS content
  const getCssContent = () => {
    if (!editor) return '';
    return editor.getCss();
  };

  // Get JS content
  const getJsContent = () => {
    if (!editor) return '';
    return editor.getJs();
  };

  // Add component
  const addComponent = (component) => {
    if (!editor) return;
    editor.addComponents(component);
  };

  // Clear editor
  const clearEditor = () => {
    if (!editor) return;
    editor.Commands.run('core:canvas-clear');
  };

  // Load content
  const loadContent = (html, css, js) => {
    if (!editor) return;
    
    clearEditor();
    editor.setComponents(html);
    editor.setStyle(css);
    
    // If JS is provided and there's a method to set it
    if (js && editor.setJs) {
      editor.setJs(js);
    }
  };

  const value = {
    editor,
    registerEditor,
    currentBlock,
    setCurrentBlock,
    selectedComponent,
    isDirty,
    setIsDirty,
    viewMode,
    changeViewMode,
    saveCurrentState,
    getHtmlContent,
    getCssContent,
    getJsContent,
    addComponent,
    clearEditor,
    loadContent
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

// Hook for using the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}; 