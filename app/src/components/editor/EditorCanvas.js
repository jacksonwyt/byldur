import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import useProjectApi from '../../hooks/useProjectApi';
import useAuthApi from '../../hooks/useAuthApi';
import { useAI } from '../../hooks/useAI';
import { useEditor } from '../../hooks/useEditor';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Spinner } from '../ui';

const EditorContainer = styled.div`
  height: 100%;
  overflow: hidden;
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
  background-color: ${props => {
    switch(props.type) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-danger)';
      case 'info': return 'var(--color-info)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  }};
  color: white;
  max-width: 350px;
  display: flex;
  align-items: center;
`;

const NotificationMessage = styled.span`
  flex: 1;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  
  p {
    margin-top: 1rem;
    font-weight: 500;
    color: var(--text-color);
  }
`;

// Utility function to debounce function calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const EditorCanvas = forwardRef(({ onReady }, ref) => {
  const editorRef = useRef(null);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading editor...');
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useAuthApi();
  const { currentProject, fetchProject, saveProjectContent, loading: projectLoading } = useProjectApi();
  const { credits, loading: aiLoading } = useAI();
  const { 
    editor, 
    registerEditor, 
    saveCurrentState, 
    getHtmlContent, 
    getCssContent,
    loadContent,
    setIsDirty
  } = useEditor();
  const analytics = useAnalytics();

  // Show notification helper
  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ visible: true, message, type });
    
    // Auto-hide notification after duration
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, duration);
  };

  // Initialize GrapesJS editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Only initialize if we don't already have an editor instance
    if (!editor) {
      setIsLoading(true);
      setLoadingMessage('Initializing editor...');
      
      const newEditor = grapesjs.init({
        container: editorRef.current,
        height: '100%',
        width: 'auto',
        storageManager: false, // We'll handle storage ourselves
        plugins: [gjsPresetWebpage],
        pluginsOpts: {
          gjsPresetWebpage: {}
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            }
          ]
        },
        blockManager: {
          appendTo: '#blocks-container',
          blocks: [
            {
              id: 'section',
              label: 'Section',
              category: 'Basic',
              content: '<section class="section"><div class="container"></div></section>',
              attributes: { class: 'gjs-block-section' }
            },
            {
              id: 'heading',
              label: 'Heading',
              category: 'Basic',
              content: '<h2>Insert your heading here</h2>',
              attributes: { class: 'fa fa-heading' }
            },
            {
              id: 'paragraph',
              label: 'Paragraph',
              category: 'Basic',
              content: '<p>Insert your text here</p>',
              attributes: { class: 'fa fa-paragraph' }
            },
            {
              id: 'image',
              label: 'Image',
              category: 'Basic',
              content: { type: 'image' },
              attributes: { class: 'fa fa-image' }
            },
            {
              id: 'link',
              label: 'Link',
              category: 'Basic',
              content: '<a href="#">Link</a>',
              attributes: { class: 'fa fa-link' }
            },
            {
              id: 'list',
              label: 'List',
              category: 'Advanced',
              content: '<ul><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ul>',
              attributes: { class: 'fa fa-list' }
            },
            {
              id: 'table',
              label: 'Table',
              category: 'Advanced',
              content: '<table class="table"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr></tbody></table>',
              attributes: { class: 'fa fa-table' }
            },
            {
              id: 'button',
              label: 'Button',
              category: 'Basic',
              content: '<button class="button">Click me</button>',
              attributes: { class: 'fa fa-square' }
            },
            {
              id: 'custom-html',
              label: 'Custom HTML',
              category: 'Advanced',
              content: {
                type: 'text',
                content: '<div>Custom HTML</div>',
              },
              attributes: { class: 'fa fa-code' }
            }
          ]
        },
        panels: {
          defaults: [
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: '<i class="fa fa-desktop"></i>',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-tablet',
                  label: '<i class="fa fa-tablet"></i>',
                  command: 'set-device-tablet',
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: '<i class="fa fa-mobile"></i>',
                  command: 'set-device-mobile',
                  togglable: false,
                }
              ]
            }
          ]
        }
      });

      // Add commands for device switching
      newEditor.Commands.add('set-device-desktop', {
        run: (editor) => editor.setDevice('Desktop')
      });
      
      newEditor.Commands.add('set-device-tablet', {
        run: (editor) => editor.setDevice('Tablet')
      });
      
      newEditor.Commands.add('set-device-mobile', {
        run: (editor) => editor.setDevice('Mobile')
      });

      // Add command for adding a section
      newEditor.Commands.add('add-section', {
        run: (editor) => {
          const section = document.createElement('section');
          section.innerHTML = '<div class="container"></div>';
          section.className = 'section';
          
          editor.DomComponents.addComponent({
            type: 'default',
            tagName: 'section',
            attributes: { class: 'section' },
            components: [{
              type: 'default',
              tagName: 'div',
              attributes: { class: 'container' }
            }]
          });
        }
      });

      // Set up editor events
      newEditor.on('component:update', debounce(() => {
        autoSaveProject();
        setIsDirty(true);
      }, 1000));
      
      newEditor.on('style:update', debounce(() => {
        autoSaveProject();
        setIsDirty(true);
      }, 1000));
      
      // Register the editor with our context
      registerEditor(newEditor);
      
      // Call onReady callback if provided
      if (typeof onReady === 'function') {
        onReady(newEditor);
      }
    }
  }, [editorRef, editor, registerEditor, onReady]);

  // Load project data when projectId changes
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId || !isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setLoadingMessage('Loading project...');
      
      try {
        // Fetch project if not already loaded
        if (!currentProject || currentProject.id !== projectId) {
          await fetchProject(projectId);
        }
        
        // Wait for editor to be ready
        if (editor) {
          if (currentProject && currentProject.content) {
            // Clear existing content and load new content
            editor.DomComponents.clear();
            
            // Load HTML and CSS content
            const { html, css } = currentProject.content;
            loadContent(html, css);
            
            showNotification('Project loaded successfully', 'success');
            setIsDirty(false);
          } else {
            // New project with no content
            showNotification('New project created', 'info');
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        showNotification(`Error loading project: ${error.message || 'Unknown error'}`, 'error', 5000);
        
        // Redirect to dashboard after error
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId, editor, isAuthenticated, currentProject, fetchProject, navigate, loadContent, setIsDirty]);

  // Function to save project content
  const saveProject = async (silent = false) => {
    if (!projectId || !isAuthenticated || !editor) {
      return;
    }
    
    setIsSaving(true);
    if (!silent) {
      setLoadingMessage('Saving project...');
      showNotification('Saving project...', 'info');
    }
    
    try {
      // Get content from editor
      const html = getHtmlContent();
      const css = getCssContent();
      
      // Track save start time for performance timing
      const startTime = performance.now();
      
      // Save to backend
      await saveProjectContent(projectId, html, css);
      
      // Track content save
      const saveTime = performance.now() - startTime;
      analytics.trackContentSaved(projectId, { contentSize: (html?.length || 0) + (css?.length || 0) });
      analytics.trackTiming('content_save', saveTime, { projectId });
      
      // Update editor state
      await saveCurrentState();
      
      if (!silent) {
        showNotification('Project saved successfully', 'success');
      }
      
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      
      // Track error
      analytics.trackError('project_save', `Failed to save project: ${error.message || 'Unknown error'}`);
      
      showNotification(`Error saving project: ${error.message || 'Unknown error'}`, 'error', 5000);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Auto-save project with less feedback
  const autoSaveProject = debounce(async () => {
    await saveProject(true);
  }, 2000);

  // Expose methods to parent via ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        saveProject,
        getEditor: () => editor
      };
    }
  }, [ref, editor, saveProject]);

  return (
    <EditorContainer>
      <div ref={editorRef} style={{ height: '100%' }}></div>
      
      {(isLoading || isSaving) && (
        <LoadingOverlay>
          <Spinner size="large" />
          <p>{isLoading ? loadingMessage : 'Saving changes...'}</p>
        </LoadingOverlay>
      )}
      
      <Notification 
        visible={notification.visible} 
        type={notification.type}
      >
        <NotificationMessage>{notification.message}</NotificationMessage>
      </Notification>
    </EditorContainer>
  );
});

// Add display name for the forwardRef component
EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas; 