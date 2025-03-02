import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaEye, FaTrash, FaCopy, FaCalendarAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

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

const ProjectName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0 0 1rem;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ProjectDate = styled.span`
  display: flex;
  align-items: center;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.1);
  }
  
  &.delete:hover {
    color: var(--color-error);
    background-color: rgba(var(--color-error-rgb), 0.1);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ProjectBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: ${props => props.published ? 'var(--color-success)' : 'var(--color-warning)'};
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
`;

// Generates a deterministic color based on the project name
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

// Get first letter of each word in the project name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ProjectCard = ({ 
  project, 
  onEdit, 
  onPreview, 
  onDelete,
  onDuplicate
}) => {
  const { 
    id, 
    name, 
    description, 
    createdAt, 
    thumbnail, 
    published = false
  } = project;
  
  const placeholderColor = generateColor(name);
  const initials = getInitials(name);
  
  const handleEdit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(id);
  };
  
  const handlePreview = (e) => {
    e.preventDefault();
    if (onPreview) onPreview(id);
  };
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };
  
  const handleDuplicate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDuplicate) onDuplicate(id);
  };
  
  return (
    <Card>
      <Link to={`/editor/${id}`}>
        <CardHeader>
          {thumbnail ? (
            <img src={thumbnail} alt={name} />
          ) : (
            <Placeholder color={placeholderColor}>
              {initials}
            </Placeholder>
          )}
          <ProjectBadge published={published}>
            {published ? 'Published' : 'Draft'}
          </ProjectBadge>
        </CardHeader>
        
        <CardBody>
          <ProjectName>{name}</ProjectName>
          <ProjectDescription>{description || 'No description provided.'}</ProjectDescription>
          
          <ProjectMeta>
            <ProjectDate>
              <FaCalendarAlt /> {formatDate(createdAt)}
            </ProjectDate>
          </ProjectMeta>
        </CardBody>
      </Link>
      
      <CardFooter>
        <ActionButtonsContainer>
          <ActionButton 
            title="Edit" 
            onClick={handleEdit}
          >
            <FaEdit />
          </ActionButton>
          <ActionButton 
            title="Preview" 
            onClick={handlePreview}
          >
            <FaEye />
          </ActionButton>
        </ActionButtonsContainer>
        
        <ActionButtonsContainer>
          <ActionButton 
            title="Duplicate" 
            onClick={handleDuplicate}
          >
            <FaCopy />
          </ActionButton>
          <ActionButton 
            title="Delete" 
            onClick={handleDelete}
            className="delete"
          >
            <FaTrash />
          </ActionButton>
        </ActionButtonsContainer>
      </CardFooter>
    </Card>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    published: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func,
  onPreview: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func
};

export default ProjectCard; 