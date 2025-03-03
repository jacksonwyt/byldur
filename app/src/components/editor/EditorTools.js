import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaChevronLeft, 
  FaDesktop, 
  FaTabletAlt, 
  FaMobile,
  FaColumns,
  FaHeading,
  FaParagraph,
  FaImage,
  FaLink,
  FaList,
  FaTable,
  FaFont,
  FaCode,
  FaSquare,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLayerGroup,
  FaUndo,
  FaRedo
} from 'react-icons/fa';
import { useEditor } from '../../hooks/useEditor';

const ToolsContainer = styled.div`
  width: ${props => props.collapsed ? '60px' : '240px'};
  height: 100%;
  background-color: var(--panel-bg-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow-y: auto;
`;

const ToolsHeader = styled.div`
  display: flex;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const ToolsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform: rotate(${props => props.collapsed ? '180deg' : '0deg'});
  
  &:hover {
    color: var(--primary-color);
  }
`;

const DeviceButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'center'};
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const DeviceButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'none'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--hover-color)'};
    color: ${props => props.active ? 'white' : 'var(--text-color)'};
  }
`;

const SectionTabs = styled.div`
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  justify-content: ${props => props.collapsed ? 'center' : 'space-around'};
`;

const SectionTab = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    color: var(--primary-color);
  }
  
  ${props => props.collapsed && `
    span {
      display: none;
    }
  `}
`;

const ToolsSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const ToolsList = styled.div`
  display: grid;
  grid-template-columns: ${props => props.collapsed ? '1fr' : 'repeat(2, 1fr)'};
  gap: 0.5rem;
`;

const ToolButton = styled.button`
  display: flex;
  flex-direction: ${props => props.collapsed ? 'column' : 'column'};
  align-items: center;
  justify-content: center;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-color);
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  svg {
    margin-bottom: ${props => props.collapsed ? '0' : '0.25rem'};
    font-size: 1.25rem;
  }
  
  span {
    font-size: 0.75rem;
    display: ${props => props.collapsed ? 'none' : 'block'};
  }
`;

const HistoryButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const HistoryButton = styled.button`
  background: none;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: none;
    }
  }
`;

const EditorTools = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('components');
  const [activeDevice, setActiveDevice] = useState('desktop');
  const { editor } = useEditor();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleDeviceChange = (device) => {
    setActiveDevice(device);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleAddComponent = (type) => {
    if (!editor) return;
    
    // Add component to the canvas based on the type
    switch (type) {
      case 'section':
        editor.Commands.run('add-section');
        break;
      case 'heading':
        editor.addComponents({
          type: 'heading',
          content: 'Insert your heading here',
          tagName: 'h2'
        });
        break;
      case 'paragraph':
        editor.addComponents({
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          tagName: 'p'
        });
        break;
      case 'image':
        editor.addComponents({
          type: 'image',
          attributes: { src: 'https://placehold.it/350x250', alt: 'Placeholder image' }
        });
        break;
      case 'link':
        editor.addComponents({
          type: 'link',
          content: 'Link Text',
          attributes: { href: '#' }
        });
        break;
      case 'list':
        editor.addComponents({
          type: 'text',
          content: '<ul><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ul>'
        });
        break;
      case 'table':
        editor.addComponents({
          type: 'text',
          content: '<table class="table"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr><tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr></tbody></table>'
        });
        break;
      case 'button':
        editor.addComponents({
          type: 'text',
          content: '<button class="button">Click me</button>'
        });
        break;
      case 'custom': {
        const customHTML = prompt('Enter your custom HTML:', '<div class="custom">Custom content</div>');
        if (customHTML) {
          editor.addComponents(customHTML);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleAlignComponent = (align) => {
    if (!editor) return;
    
    // Apply alignment style to selected component
    selectedComponent.addStyle({
      'text-align': align
    });
  };

  const handleUndo = () => {
    if (!editor) return;
    editor.UndoManager.undo();
  };

  const handleRedo = () => {
    if (!editor) return;
    editor.UndoManager.redo();
  };

  // Update active device when viewMode changes from other components
  useEffect(() => {
    switch (viewMode) {
      case 'desktop':
        setActiveDevice('desktop');
        break;
      case 'tablet':
        setActiveDevice('tablet');
        break;
      case 'mobile':
        setActiveDevice('mobile');
        break;
      default:
        break;
    }
  }, [viewMode]);

  return (
    <ToolsContainer collapsed={collapsed}>
      <ToolsHeader collapsed={collapsed}>
        <ToolsTitle collapsed={collapsed}>Editor Tools</ToolsTitle>
        <CollapseButton 
          collapsed={collapsed} 
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand tools panel" : "Collapse tools panel"}
        >
          <FaChevronLeft />
        </CollapseButton>
      </ToolsHeader>
      
      <HistoryButtons>
        <HistoryButton onClick={handleUndo} aria-label="Undo">
          <FaUndo />
        </HistoryButton>
        <HistoryButton onClick={handleRedo} aria-label="Redo">
          <FaRedo />
        </HistoryButton>
      </HistoryButtons>
      
      <DeviceButtons collapsed={collapsed}>
        <DeviceButton 
          active={activeDevice === 'desktop'} 
          onClick={() => handleDeviceChange('desktop')}
          aria-label="Desktop view"
        >
          <FaDesktop />
        </DeviceButton>
        <DeviceButton 
          active={activeDevice === 'tablet'} 
          onClick={() => handleDeviceChange('tablet')}
          aria-label="Tablet view"
        >
          <FaTabletAlt />
        </DeviceButton>
        <DeviceButton 
          active={activeDevice === 'mobile'} 
          onClick={() => handleDeviceChange('mobile')}
          aria-label="Mobile view"
        >
          <FaMobile />
        </DeviceButton>
      </DeviceButtons>
      
      <SectionTabs collapsed={collapsed}>
        <SectionTab 
          active={activeSection === 'blocks'} 
          onClick={() => handleSectionChange('blocks')}
          collapsed={collapsed}
        >
          <FaLayerGroup />
          <span>Blocks</span>
        </SectionTab>
        <SectionTab 
          active={activeSection === 'style'} 
          onClick={() => handleSectionChange('style')}
          collapsed={collapsed}
        >
          <FaFont />
          <span>Style</span>
        </SectionTab>
      </SectionTabs>
      
      {activeSection === 'blocks' && (
        <>
          <ToolsSection>
            <SectionTitle collapsed={collapsed}>Basic</SectionTitle>
            <ToolsList collapsed={collapsed}>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('section')}
                aria-label="Add section"
              >
                <FaColumns />
                <span>Section</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('heading')}
                aria-label="Add heading"
              >
                <FaHeading />
                <span>Heading</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('paragraph')}
                aria-label="Add paragraph"
              >
                <FaParagraph />
                <span>Paragraph</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('image')}
                aria-label="Add image"
              >
                <FaImage />
                <span>Image</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('link')}
                aria-label="Add link"
              >
                <FaLink />
                <span>Link</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('button')}
                aria-label="Add button"
              >
                <FaSquare />
                <span>Button</span>
              </ToolButton>
            </ToolsList>
          </ToolsSection>
          
          <ToolsSection>
            <SectionTitle collapsed={collapsed}>Advanced</SectionTitle>
            <ToolsList collapsed={collapsed}>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('list')}
                aria-label="Add list"
              >
                <FaList />
                <span>List</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('table')}
                aria-label="Add table"
              >
                <FaTable />
                <span>Table</span>
              </ToolButton>
              <ToolButton 
                collapsed={collapsed} 
                onClick={() => handleAddComponent('custom')}
                aria-label="Add custom HTML"
              >
                <FaCode />
                <span>Custom HTML</span>
              </ToolButton>
            </ToolsList>
          </ToolsSection>
        </>
      )}
      
      {activeSection === 'style' && selectedComponent && (
        <ToolsSection>
          <SectionTitle collapsed={collapsed}>Text Alignment</SectionTitle>
          <ToolsList collapsed={collapsed}>
            <ToolButton 
              collapsed={collapsed} 
              onClick={() => handleAlignComponent('left')}
              aria-label="Align left"
            >
              <FaAlignLeft />
              <span>Left</span>
            </ToolButton>
            <ToolButton 
              collapsed={collapsed} 
              onClick={() => handleAlignComponent('center')}
              aria-label="Align center"
            >
              <FaAlignCenter />
              <span>Center</span>
            </ToolButton>
            <ToolButton 
              collapsed={collapsed} 
              onClick={() => handleAlignComponent('right')}
              aria-label="Align right"
            >
              <FaAlignRight />
              <span>Right</span>
            </ToolButton>
          </ToolsList>
        </ToolsSection>
      )}
    </ToolsContainer>
  );
};

export default EditorTools; 