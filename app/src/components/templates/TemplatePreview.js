import React from 'react';
import styled from 'styled-components';
import { FaTag, FaCalendarAlt, FaDesktop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Button, Spinner } from '../ui';

const PreviewContainer = styled.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
`;

const PreviewHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const TemplateName = styled.h2`
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.5rem;
`;

const TemplateDescription = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const MetadataList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  
  svg {
    color: var(--primary-color);
  }
`;

const DeviceToggle = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
`;

const DeviceButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color-dark)' : 'var(--bg-color-hover)'};
  }
`;

const PreviewFrame = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  
  iframe {
    width: 100%;
    height: ${props => props.device === 'mobile' ? '667px' : '100%'};
    max-width: ${props => props.device === 'mobile' ? '375px' : props.device === 'tablet' ? '768px' : '100%'};
    border: none;
    margin: 0 auto;
    display: block;
    background-color: white;
  }
`;

const ImagePreview = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PreviewInfo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--bg-color-secondary);
  color: var(--text-color-secondary);
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    max-width: 400px;
    text-align: center;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const TemplatePreview = ({ 
  template, 
  onUse, 
  onBack,
  loadingPreview = false
}) => {
  const [device, setDevice] = React.useState('desktop');
  
  if (!template) {
    return (
      <PreviewContainer>
        <Placeholder>
          <h3>No template selected</h3>
          <p>Select a template from the list to see a preview.</p>
        </Placeholder>
      </PreviewContainer>
    );
  }
  
  const { 
    name, 
    description, 
    category, 
    createdAt, 
    previewUrl, 
    thumbnail 
  } = template;
  
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString() 
    : 'Unknown date';
  
  return (
    <PreviewContainer>
      <PreviewHeader>
        <TemplateName>{name}</TemplateName>
        <TemplateDescription>
          {description || 'No description available for this template.'}
        </TemplateDescription>
        
        <MetadataList>
          {category && (
            <MetadataItem>
              <FaTag /> {category}
            </MetadataItem>
          )}
          <MetadataItem>
            <FaCalendarAlt /> Added: {formattedDate}
          </MetadataItem>
        </MetadataList>
      </PreviewHeader>
      
      {previewUrl && (
        <DeviceToggle>
          <DeviceButton 
            active={device === 'desktop'} 
            onClick={() => setDevice('desktop')}
          >
            <FaDesktop /> Desktop
          </DeviceButton>
          <DeviceButton 
            active={device === 'tablet'} 
            onClick={() => setDevice('tablet')}
          >
            <FaTabletAlt /> Tablet
          </DeviceButton>
          <DeviceButton 
            active={device === 'mobile'} 
            onClick={() => setDevice('mobile')}
          >
            <FaMobileAlt /> Mobile
          </DeviceButton>
        </DeviceToggle>
      )}
      
      {loadingPreview ? (
        <Spinner message="Loading preview..." />
      ) : previewUrl ? (
        <PreviewFrame device={device}>
          <iframe 
            src={previewUrl} 
            title={`Preview of ${name}`} 
            sandbox="allow-same-origin allow-scripts"
          />
          <PreviewInfo>
            Preview Mode - Some features may be limited
          </PreviewInfo>
        </PreviewFrame>
      ) : thumbnail ? (
        <ImagePreview>
          <img src={thumbnail} alt={`Preview of ${name} template`} />
        </ImagePreview>
      ) : (
        <Placeholder>
          <h3>No preview available</h3>
          <p>This template doesn't have a preview yet.</p>
        </Placeholder>
      )}
      
      <ActionBar>
        <Button variant="secondary" onClick={onBack}>
          Back to Templates
        </Button>
        
        <Button onClick={() => onUse(template)}>
          Use This Template
        </Button>
      </ActionBar>
    </PreviewContainer>
  );
};

TemplatePreview.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
    previewUrl: PropTypes.string,
    createdAt: PropTypes.string
  }),
  onUse: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  loadingPreview: PropTypes.bool
};

export default TemplatePreview; 