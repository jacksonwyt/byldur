import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash, FaCopy, FaCloudUploadAlt, FaToggleOn, FaToggleOff, FaHistory } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Button } from '../ui';
import useProjectApi from '../../hooks/useProjectApi';
import { useAnalytics } from '../../hooks/useAnalytics';

const ActionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Button)`
  flex: 1;
  min-width: 120px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--color-bg-primary);
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: var(--color-text-primary);
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const DeploymentHistoryItem = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
`;

const ProjectActions = ({ projectId, isPublished = false }) => {
  const navigate = useNavigate();
  const { 
    duplicateProject, 
    deleteProject, 
    publishProject, 
    unpublishProject, 
    deployProject, 
    getDeploymentHistory,
    deployments,
    loading 
  } = useProjectApi();
  const analytics = useAnalytics();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const handleEdit = () => {
    analytics.trackEditorOpened(projectId);
    navigate(`/editor/${projectId}`);
  };
  
  const handlePreview = () => {
    analytics.trackFeatureUsage('project_preview', 'opened', projectId);
    window.open(`/preview/${projectId}`, '_blank');
  };
  
  const handleDuplicate = async () => {
    if (loading) return;
    
    const duplicated = await duplicateProject(projectId);
    if (duplicated) {
      analytics.trackProjectDuplicated(projectId);
      navigate(`/projects/${duplicated.id}`);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (loading) return;
    
    const deleted = await deleteProject(projectId);
    if (deleted) {
      analytics.trackProjectDeleted(projectId);
      setShowDeleteModal(false);
      navigate('/dashboard');
    }
  };
  
  const handlePublishToggle = async () => {
    if (loading) return;
    
    if (isPublished) {
      await unpublishProject(projectId);
      analytics.trackProjectUnpublished(projectId);
    } else {
      await publishProject(projectId);
      analytics.trackProjectPublished(projectId);
    }
  };
  
  const handleDeploy = async () => {
    if (loading) return;
    
    await deployProject(projectId);
    analytics.trackProjectDeployed(projectId);
    setShowDeployModal(false);
  };
  
  const handleShowHistory = async () => {
    analytics.trackFeatureUsage('deployment_history', 'viewed', projectId);
    await getDeploymentHistory(projectId);
    setShowHistoryModal(true);
  };
  
  return (
    <>
      <ActionContainer>
        <ActionButton 
          variant="primary" 
          onClick={handleEdit}
          aria-label="Edit project"
        >
          <FaEdit /> Edit
        </ActionButton>
        
        <ActionButton 
          variant="secondary" 
          onClick={handlePreview}
          aria-label="Preview project"
        >
          <FaEye /> Preview
        </ActionButton>
        
        <ActionButton 
          variant="outline" 
          onClick={handleDuplicate}
          disabled={loading}
          aria-label="Duplicate project"
        >
          <FaCopy /> Duplicate
        </ActionButton>
        
        <ActionButton 
          variant={isPublished ? "outline" : "primary"}
          onClick={handlePublishToggle}
          disabled={loading}
          aria-label={isPublished ? "Unpublish project" : "Publish project"}
        >
          {isPublished ? <FaToggleOff /> : <FaToggleOn />} {isPublished ? "Unpublish" : "Publish"}
        </ActionButton>
        
        <ActionButton 
          variant="primary" 
          onClick={() => setShowDeployModal(true)}
          disabled={loading || !isPublished}
          aria-label="Deploy project"
        >
          <FaCloudUploadAlt /> Deploy
        </ActionButton>
        
        <ActionButton 
          variant="outline" 
          onClick={handleShowHistory}
          disabled={loading}
          aria-label="View deployment history"
        >
          <FaHistory /> History
        </ActionButton>
        
        <ActionButton 
          variant="danger" 
          onClick={() => setShowDeleteModal(true)}
          disabled={loading}
          aria-label="Delete project"
        >
          <FaTrash /> Delete
        </ActionButton>
      </ActionContainer>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Confirm Delete</ModalTitle>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <ModalButtons>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteConfirm}
                loading={loading}
              >
                Delete
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
      
      {/* Deploy Confirmation Modal */}
      {showDeployModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Deploy Project</ModalTitle>
            <p>Are you sure you want to deploy this project to production? This will make your changes live to all visitors.</p>
            <ModalButtons>
              <Button 
                variant="outline" 
                onClick={() => setShowDeployModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleDeploy}
                loading={loading}
              >
                Deploy
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
      
      {/* Deployment History Modal */}
      {showHistoryModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Deployment History</ModalTitle>
            {deployments.length === 0 ? (
              <p>No deployment history found.</p>
            ) : (
              deployments.map((deployment, index) => (
                <DeploymentHistoryItem key={deployment.id || index}>
                  <h4>Deployment {index + 1}</h4>
                  <p><strong>Date:</strong> {new Date(deployment.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> {deployment.status}</p>
                  {deployment.url && (
                    <p>
                      <strong>URL:</strong> <a href={deployment.url} target="_blank" rel="noopener noreferrer">{deployment.url}</a>
                    </p>
                  )}
                </DeploymentHistoryItem>
              ))
            )}
            <ModalButtons>
              <Button 
                variant="primary" 
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

ProjectActions.propTypes = {
  projectId: PropTypes.string.isRequired,
  isPublished: PropTypes.bool
};

export default ProjectActions; 