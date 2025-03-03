import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaCopy, 
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import useProjectApi from '../hooks/useProjectApi';
import useAuthApi from '../hooks/useAuthApi';
import { Button, Spinner, Badge } from '../components/ui';
import { formatDate, getRelativeTimeString } from '../utils/dateUtils';
import ProjectActions from '../components/projects/ProjectActions';

const ProjectDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    display: flex;
    align-items: center;
    
    &:hover {
      color: var(--color-primary);
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  span {
    margin: 0 0.5rem;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProjectTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
`;

const ProjectStatus = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => props.published ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'};
  color: ${props => props.published ? 'var(--color-success)' : 'var(--color-warning)'};
  margin-bottom: 1rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  background-color: var(--color-bg-card);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetadataItem = styled.div`
  h3 {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0 0 0.25rem;
  }
  
  p {
    font-size: 1rem;
    color: var(--color-text-primary);
    margin: 0;
  }
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  margin-bottom: 1.5rem;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const DangerZone = styled.div`
  border: 1px solid var(--color-error);
  border-radius: 0.5rem;
  padding: 1.5rem;
  
  h3 {
    color: var(--color-error);
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }
`;

const ConfirmationDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  h2 {
    margin-top: 0;
    color: var(--color-text-primary);
  }
  
  p {
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
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

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthApi();
  const { 
    getProject, 
    deleteProject, 
    duplicateProject, 
    publishProject,
  } = useProjectApi();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!projectId) return;
      
      try {
        const project = await getProject(projectId);
        setProject(project);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load project data:', err);
        setError('Failed to load project data. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId, getProject]);

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError(`Failed to delete project: ${err.message}`);
    }
  };

  const handleDuplicateProject = async () => {
    try {
      const newProject = await duplicateProject(projectId);
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      console.error('Failed to duplicate project:', err);
      setError(`Failed to duplicate project: ${err.message}`);
    }
  };
  
  const handlePublishToggle = async () => {
    if (!project) return;
    
    try {
      if (project.isPublished) {
        await publishProject(projectId, false);
      } else {
        await publishProject(projectId, true);
      }
      
      // Update local state
      setProject({
        ...project,
        isPublished: !project.isPublished
      });
    } catch (err) {
      console.error('Failed to toggle publish state:', err);
      setError(`Failed to toggle publish state: ${err.message}`);
    }
  };
  
  if (loading) {
    return (
      <ProjectDetailsContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner size="60px" />
        </div>
      </ProjectDetailsContainer>
    );
  }
  
  if (error) {
    return (
      <ProjectDetailsContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-danger)' }}>
          <FaExclamationTriangle size={60} />
          <h2>Error Loading Project</h2>
          <p>{error}</p>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </ProjectDetailsContainer>
    );
  }
  
  if (!project) {
    return (
      <ProjectDetailsContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Project Not Found</h2>
          <p>The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </ProjectDetailsContainer>
    );
  }
 
  const placeholderColor = generateColor(project.name);
  const initials = getInitials(project.name);
  
  return (
    <ProjectDetailsContainer>
      <Breadcrumbs>
        <Link to="/dashboard">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <span>/</span>
        <span>{project.name}</span>
      </Breadcrumbs>
      
      <ProjectHeader>
        <div>
          <ProjectTitle>{project.name}</ProjectTitle>
          {project.isPublished && (
            <Badge variant="success">
              <FaCheckCircle /> Published
            </Badge>
          )}
        </div>
        
        <ActionButtons>
          <Button 
            secondary 
            onClick={handlePublishToggle}
          >
            {project.isPublished ? (
              <>
                <FaCloudDownloadAlt /> Unpublish
              </>
            ) : (
              <>
                <FaCloudUploadAlt /> Publish
              </>
            )}
          </Button>
          
          <Button 
            secondary
            onClick={handleDuplicateProject}
          >
            <FaCopy /> Duplicate
          </Button>
          
          <Button 
            as={Link}
            to={`/editor/${projectId}`}
            primary
          >
            <FaEdit /> Edit
          </Button>
        </ActionButtons>
      </ProjectHeader>
      
      <ContentGrid>
        <div>
          <Section>
            <SectionTitle>Project Details</SectionTitle>
            <ProjectDescription>
              {project.description || 'No description provided.'}
            </ProjectDescription>
            
            <MetadataGrid>
              <MetadataItem>
                <h3>Created By</h3>
                <p>{user?.name || 'Unknown User'}</p>
              </MetadataItem>
              
              <MetadataItem>
                <h3>Created On</h3>
                <p>{formatDate(project.createdAt)}</p>
              </MetadataItem>
              
              <MetadataItem>
                <h3>Last Modified</h3>
                <p>{formatDate(project.updatedAt) || 'Not modified'}</p>
              </MetadataItem>
              
              <MetadataItem>
                <h3>Status</h3>
                <p>{project.isPublished ? 'Published' : 'Draft'}</p>
              </MetadataItem>
            </MetadataGrid>
            
            <SectionTitle>Project Screenshot</SectionTitle>
            <ThumbnailContainer>
              {project.thumbnail ? (
                <Thumbnail src={project.thumbnail} alt={project.name} />
              ) : (
                <Placeholder color={placeholderColor}>
                  {initials}
                </Placeholder>
              )}
            </ThumbnailContainer>
            
            <Button as="a" href={`/preview/${projectId}`} target="_blank" secondary>
              <FaEye /> Preview Project
            </Button>
          </Section>
        </div>
        
        <div>
          <Section>
            <SectionTitle>Actions</SectionTitle>
            <ProjectActions 
              projectId={projectId} 
              isPublished={project.isPublished} 
            />
            
            <DangerZone>
              <h3>
                <FaExclamationTriangle /> Danger Zone
              </h3>
              <p>Once you delete a project, there is no going back. Please be certain.</p>
              
              <Button 
                danger 
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrash /> Delete Project
              </Button>
            </DangerZone>
          </Section>
        </div>
      </ContentGrid>
      
      {showDeleteModal && (
        <ConfirmationDialog>
          <DialogContent>
            <h2>Delete Project</h2>
            <p>
              Are you sure you want to delete <strong>{project.name}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="actions">
              <Button 
                secondary
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              
              <Button 
                danger
                onClick={handleDeleteProject}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </ConfirmationDialog>
      )}
    </ProjectDetailsContainer>
  );
};

export default ProjectDetails; 