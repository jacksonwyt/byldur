import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPuzzlePiece, FaColumns, FaTextHeight, FaImage, FaListUl, FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaSave, FaTrash, FaTimes } from 'react-icons/fa';
import useAuthApi from '../hooks/useAuthApi';

const PageContainer = styled.div`
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
`;

const DemoHeader = styled.div`
  background-color: var(--card-bg-color);
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--bg-light)'};
  }
`;

const DemoContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: var(--card-bg-color);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
`;

const ComponentsSection = styled.div`
  padding: 15px;
`;

const SectionTitle = styled.h3`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const ComponentBlock = styled.div`
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-color-light);
  }
`;

const ComponentIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: var(--text-color-secondary);
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorToolbar = styled.div`
  background-color: var(--card-bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  overflow-x: auto;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-right: 15px;
  border-right: 1px solid var(--border-color);
  
  &:last-child {
    border-right: none;
  }
`;

const ToolbarButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--bg-light);
  }
  
  &.active {
    background-color: var(--primary-color-light);
    color: var(--primary-color);
  }
`;

const Canvas = styled.div`
  flex: 1;
  padding: 20px;
  background-color: var(--bg-light);
  overflow-y: auto;
`;

const EditableArea = styled.div`
  min-height: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: var(--card-shadow);
  padding: 40px;
`;

const DemoNotice = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  text-align: center;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const SignUpButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

// Demo content elements
const BlockHeader = styled.div`
  background-color: var(--bg-light);
  border: 1px dashed var(--border-color);
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const BlockSection = styled.div`
  background-color: var(--bg-light);
  border: 1px dashed var(--border-color);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const BlockText = styled.div`
  background-color: var(--bg-light);
  border: 1px dashed var(--border-color);
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const BlockImage = styled.div`
  background-color: var(--bg-light);
  border: 1px dashed var(--border-color);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border-radius: 4px;
  color: var(--text-color-secondary);
`;

const BlockButton = styled.div`
  background-color: var(--bg-light);
  border: 1px dashed var(--border-color);
  padding: 10px 20px;
  display: inline-block;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Demo = () => {
  const { isAuthenticated } = useAuthApi();
  const [showNotice, setShowNotice] = useState(true);
  const [components, setComponents] = useState([]);
  
  useEffect(() => {
    // Initialize with some demo components
    setComponents([
      { id: 1, type: 'header', content: 'Demo Website Header' },
      { id: 2, type: 'text', content: 'This is a demo of the Byldur website builder. Try adding and removing components using the sidebar on the left. This is a simplified version - sign up for free to access all features!' },
      { id: 3, type: 'image', content: 'Image Placeholder' },
      { id: 4, type: 'button', content: 'Click Me' }
    ]);
  }, []);
  
  const addComponent = (type) => {
    const newId = components.length > 0 ? Math.max(...components.map(c => c.id)) + 1 : 1;
    
    let content = 'New Component';
    switch(type) {
      case 'header':
        content = 'New Header';
        break;
      case 'text':
        content = 'New Text Block';
        break;
      case 'image':
        content = 'Image Placeholder';
        break;
      case 'button':
        content = 'Button';
        break;
      case 'list':
        content = 'List Items';
        break;
      default:
        content = 'New Component';
    }
    
    setComponents([...components, { id: newId, type, content }]);
  };
  
  const removeComponent = (id) => {
    setComponents(components.filter(component => component.id !== id));
  };
  
  const renderComponent = (component) => {
    switch(component.type) {
      case 'header':
        return (
          <BlockHeader key={component.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{component.content}</h2>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </BlockHeader>
        );
      case 'section':
        return (
          <BlockSection key={component.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{component.content}</div>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </BlockSection>
        );
      case 'text':
        return (
          <BlockText key={component.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>{component.content}</p>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </BlockText>
        );
      case 'image':
        return (
          <BlockImage key={component.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              <div><FaImage style={{ marginRight: '10px' }} /> {component.content}</div>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </BlockImage>
        );
      case 'button':
        return (
          <div style={{ marginBottom: '20px' }} key={component.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BlockButton>{component.content}</BlockButton>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </div>
        );
      case 'list':
        return (
          <BlockText key={component.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <ul>
                <li>List Item 1</li>
                <li>List Item 2</li>
                <li>List Item 3</li>
              </ul>
              <ToolbarButton onClick={() => removeComponent(component.id)}>
                <FaTrash />
              </ToolbarButton>
            </div>
          </BlockText>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageContainer>
      <DemoHeader>
        <HeaderTitle>Byldur Demo Editor</HeaderTitle>
        <HeaderActions>
          <Button>
            <FaPuzzlePiece /> Templates
          </Button>
          <Button primary>
            <FaSave /> Save Design
          </Button>
        </HeaderActions>
      </DemoHeader>
      
      <DemoContent>
        <Sidebar>
          <ComponentsSection>
            <SectionTitle>LAYOUT</SectionTitle>
            <ComponentGrid>
              <ComponentBlock onClick={() => addComponent('section')}>
                <ComponentIcon>
                  <FaColumns />
                </ComponentIcon>
                Section
              </ComponentBlock>
              <ComponentBlock onClick={() => addComponent('header')}>
                <ComponentIcon>
                  <FaTextHeight />
                </ComponentIcon>
                Header
              </ComponentBlock>
            </ComponentGrid>
          </ComponentsSection>
          
          <ComponentsSection>
            <SectionTitle>ELEMENTS</SectionTitle>
            <ComponentGrid>
              <ComponentBlock onClick={() => addComponent('text')}>
                <ComponentIcon>
                  <FaTextHeight />
                </ComponentIcon>
                Text
              </ComponentBlock>
              <ComponentBlock onClick={() => addComponent('image')}>
                <ComponentIcon>
                  <FaImage />
                </ComponentIcon>
                Image
              </ComponentBlock>
              <ComponentBlock onClick={() => addComponent('button')}>
                <ComponentIcon>
                  <FaColumns />
                </ComponentIcon>
                Button
              </ComponentBlock>
              <ComponentBlock onClick={() => addComponent('list')}>
                <ComponentIcon>
                  <FaListUl />
                </ComponentIcon>
                List
              </ComponentBlock>
            </ComponentGrid>
          </ComponentsSection>
        </Sidebar>
        
        <EditorArea>
          <EditorToolbar>
            <ToolbarGroup>
              <ToolbarButton className="active">
                <FaBold />
              </ToolbarButton>
              <ToolbarButton>
                <FaItalic />
              </ToolbarButton>
              <ToolbarButton>
                <FaUnderline />
              </ToolbarButton>
            </ToolbarGroup>
            
            <ToolbarGroup>
              <ToolbarButton className="active">
                <FaAlignLeft />
              </ToolbarButton>
              <ToolbarButton>
                <FaAlignCenter />
              </ToolbarButton>
              <ToolbarButton>
                <FaAlignRight />
              </ToolbarButton>
              <ToolbarButton>
                <FaAlignJustify />
              </ToolbarButton>
            </ToolbarGroup>
          </EditorToolbar>
          
          <Canvas>
            <EditableArea>
              {components.map(component => renderComponent(component))}
            </EditableArea>
          </Canvas>
        </EditorArea>
      </DemoContent>
      
      {showNotice && (
        <DemoNotice>
          <div>
            This is a limited demo of Byldur. Sign up for free to access all features and create your own website!
          </div>
          <SignUpButton to={isAuthenticated ? "/dashboard" : "/register"}>
            {isAuthenticated ? "Go to Dashboard" : "Sign Up Free"} <FaArrowRight />
          </SignUpButton>
          <Button onClick={() => setShowNotice(false)}>
            <FaTimes />
          </Button>
        </DemoNotice>
      )}
    </PageContainer>
  );
};

export default Demo; 