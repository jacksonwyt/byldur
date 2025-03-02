import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaUsers, FaUserPlus, FaTrash, FaPencilAlt, FaCircle, FaEnvelope } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useAuth } from '../../hooks/useAuth';

const CollaboratorsContainer = styled.div`
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const CollaboratorsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CollaboratorsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CollaboratorItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
`;

const OnlineIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${props => props.isOnline ? 'var(--color-success)' : 'var(--color-text-secondary)'};
  
  svg {
    color: ${props => props.isOnline ? 'var(--color-success)' : 'var(--color-text-secondary)'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch(props.role) {
      case 'owner':
        return 'var(--color-primary-light)';
      case 'admin':
        return 'var(--color-info-light)';
      case 'editor':
        return 'var(--color-success-light)';
      case 'viewer':
        return 'var(--color-warning-light)';
      default:
        return 'var(--color-bg-tertiary)';
    }
  }};
  color: ${props => {
    switch(props.role) {
      case 'owner':
        return 'var(--color-primary)';
      case 'admin':
        return 'var(--color-info)';
      case 'editor':
        return 'var(--color-success)';
      case 'viewer':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-secondary)';
    }
  }};
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    background-color: var(--color-bg-input);
    color: var(--color-text-primary);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

// Generate a color based on name
const generateColor = (name) => {
  const colors = [
    '#4285F4', '#DB4437', '#F4B400', '#0F9D58', // Google colors
    '#6200EA', '#2962FF', '#00BFA5', '#FFD600', // Material colors
    '#FF6D00', '#AA00FF', '#64DD17', '#304FFE', // More material colors
  ];
  
  if (!name) return colors[0];
  
  // Simple hash function to generate an index
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const CollaboratorsPanel = ({ projectId }) => {
  const { user } = useAuth();
  const { 
    activeUsers, 
    connected,
    inviteCollaborator, 
    removeCollaborator, 
    updateCollaboratorRole, 
    getCollaborators 
  } = useCollaboration();
  
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [currentCollaborator, setCurrentCollaborator] = useState(null);
  
  // Fetch collaborators when the component mounts
  useEffect(() => {
    const fetchCollaborators = async () => {
      setLoading(true);
      const data = await getCollaborators();
      setCollaborators(data);
      setLoading(false);
    };
    
    fetchCollaborators();
  }, [getCollaborators]);
  
  // Handle inviting a new collaborator
  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    const result = await inviteCollaborator(email, role);
    setLoading(false);
    
    if (result) {
      // Update collaborators list
      setCollaborators(prev => [...prev, result]);
      
      // Reset form and close modal
      setEmail('');
      setRole('editor');
      setShowInviteModal(false);
    }
  };
  
  // Handle removing a collaborator
  const handleRemove = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }
    
    setLoading(true);
    const success = await removeCollaborator(collaboratorId);
    setLoading(false);
    
    if (success) {
      // Update collaborators list
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    }
  };
  
  // Open edit modal for a collaborator
  const handleOpenEditModal = (collaborator) => {
    setCurrentCollaborator(collaborator);
    setRole(collaborator.role);
    setShowEditModal(true);
  };
  
  // Handle updating a collaborator's role
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    
    if (!currentCollaborator) return;
    
    setLoading(true);
    const success = await updateCollaboratorRole(currentCollaborator.id, role);
    setLoading(false);
    
    if (success) {
      // Update collaborators list
      setCollaborators(prev => 
        prev.map(c => c.id === currentCollaborator.id ? { ...c, role } : c)
      );
      
      // Reset form and close modal
      setCurrentCollaborator(null);
      setRole('editor');
      setShowEditModal(false);
    }
  };
  
  // Check if a user is online
  const isUserOnline = (userId) => {
    return activeUsers.some(u => u.userId === userId);
  };
  
  return (
    <CollaboratorsContainer>
      <CollaboratorsHeader>
        <h3><FaUsers /> Collaborators</h3>
        <Button
          variant="outline"
          size="small"
          onClick={() => setShowInviteModal(true)}
        >
          <FaUserPlus /> Invite
        </Button>
      </CollaboratorsHeader>
      
      <CollaboratorsList>
        {/* Project Owner */}
        {collaborators.filter(c => c.role === 'owner').map(collaborator => (
          <CollaboratorItem key={collaborator.id}>
            <UserInfo>
              <Avatar color={generateColor(collaborator.name)}>
                {getInitials(collaborator.name)}
              </Avatar>
              <UserDetails>
                <h4>{collaborator.name} {collaborator.id === user?.id && '(You)'}</h4>
                <p>{collaborator.email}</p>
              </UserDetails>
            </UserInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <OnlineIndicator isOnline={isUserOnline(collaborator.id)}>
                <FaCircle size={8} /> {isUserOnline(collaborator.id) ? 'Online' : 'Offline'}
              </OnlineIndicator>
              <RoleBadge role={collaborator.role}>
                {collaborator.role}
              </RoleBadge>
            </div>
          </CollaboratorItem>
        ))}
        
        {/* Other Collaborators */}
        {collaborators.filter(c => c.role !== 'owner').map(collaborator => (
          <CollaboratorItem key={collaborator.id}>
            <UserInfo>
              <Avatar color={generateColor(collaborator.name)}>
                {getInitials(collaborator.name)}
              </Avatar>
              <UserDetails>
                <h4>{collaborator.name} {collaborator.id === user?.id && '(You)'}</h4>
                <p>{collaborator.email}</p>
              </UserDetails>
            </UserInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <OnlineIndicator isOnline={isUserOnline(collaborator.id)}>
                <FaCircle size={8} /> {isUserOnline(collaborator.id) ? 'Online' : 'Offline'}
              </OnlineIndicator>
              <RoleBadge role={collaborator.role}>
                {collaborator.role}
              </RoleBadge>
              
              {/* Only show action buttons if current user is the owner */}
              {collaborators.find(c => c.id === user?.id)?.role === 'owner' && (
                <ActionButtons>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleOpenEditModal(collaborator)}
                    aria-label="Edit collaborator"
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleRemove(collaborator.id)}
                    aria-label="Remove collaborator"
                  >
                    <FaTrash />
                  </Button>
                </ActionButtons>
              )}
            </div>
          </CollaboratorItem>
        ))}
        
        {collaborators.length === 0 && !loading && (
          <p>No collaborators yet. Invite someone to collaborate on this project!</p>
        )}
        
        {loading && <p>Loading collaborators...</p>}
      </CollaboratorsList>
      
      {/* Invite Modal */}
      {showInviteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Invite Collaborator</ModalTitle>
            <form onSubmit={handleInvite}>
              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="editor">Editor (Can edit)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </FormGroup>
              <ModalButtons>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={loading}
                >
                  <FaEnvelope /> Send Invitation
                </Button>
              </ModalButtons>
            </form>
          </ModalContent>
        </Modal>
      )}
      
      {/* Edit Role Modal */}
      {showEditModal && currentCollaborator && (
        <Modal>
          <ModalContent>
            <ModalTitle>Edit Collaborator</ModalTitle>
            <form onSubmit={handleUpdateRole}>
              <UserInfo style={{ marginBottom: '1.5rem' }}>
                <Avatar color={generateColor(currentCollaborator.name)}>
                  {getInitials(currentCollaborator.name)}
                </Avatar>
                <UserDetails>
                  <h4>{currentCollaborator.name}</h4>
                  <p>{currentCollaborator.email}</p>
                </UserDetails>
              </UserInfo>
              <FormGroup>
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="editor">Editor (Can edit)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </FormGroup>
              <ModalButtons>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={loading}
                >
                  Update Role
                </Button>
              </ModalButtons>
            </form>
          </ModalContent>
        </Modal>
      )}
    </CollaboratorsContainer>
  );
};

CollaboratorsPanel.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default CollaboratorsPanel; 