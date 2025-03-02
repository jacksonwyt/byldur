import React from 'react';
import styled from 'styled-components';
import { FaTag, FaClipboard, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Card = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  position: relative;
  height: 160px;
  background-color: var(--color-bg-secondary);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color || 'var(--color-primary-light)'};
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 2rem;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TemplateName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TemplateDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0 0 1rem;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const TemplateMeta = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
`;

const UseTemplateButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.4);
  }
  
  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Generates a deterministic color based on the template name
const generateColor = (name) => {
  const colors = [
    '#4299E1', // blue
    '#48BB78', // green
    '#ED8936', // orange
    '#9F7AEA', // purple
    '#F56565', // red
    '#38B2AC', // teal
    '#ECC94B', // yellow
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Get first letter of each word in the template name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const TemplateCard = ({ 
  template, 
  selected = false, 
  onSelect, 
  onUse 
}) => {
  const { 
    id, 
    name, 
    description, 
    category, 
    thumbnail 
  } = template;
  
  const placeholderColor = generateColor(name);
  const initials = getInitials(name);
  
  const handleCardClick = () => {
    if (onSelect) onSelect(id);
  };
  
  const handleUseTemplate = (e) => {
    e.stopPropagation();
    if (onUse) onUse(id);
  };
  
  return (
    <Card 
      selected={selected} 
      onClick={handleCardClick}
    >
      <CardHeader>
        {thumbnail ? (
          <img src={thumbnail} alt={name} />
        ) : (
          <Placeholder color={placeholderColor}>
            {initials}
          </Placeholder>
        )}
        {selected && <SelectedIndicator>✓</SelectedIndicator>}
      </CardHeader>
      
      <CardBody>
        <TemplateName>{name}</TemplateName>
        <TemplateDescription>
          {description || 'No description provided.'}
        </TemplateDescription>
        
        <TemplateMeta>
          <FaTag /> {category || 'General'}
        </TemplateMeta>
      </CardBody>
      
      <CardFooter>
        <UseTemplateButton onClick={handleUseTemplate}>
          <FaPlus /> Use Template
        </UseTemplateButton>
      </CardFooter>
    </Card>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    thumbnail: PropTypes.string
  }).isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onUse: PropTypes.func
};

export default TemplateCard; 