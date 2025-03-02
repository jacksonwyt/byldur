import React from 'react';
import styled from 'styled-components';
import { FaCircle } from 'react-icons/fa';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useAuth } from '../../hooks/useAuth';

const ActiveUsersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  
  & > * {
    margin-left: -8px;
    box-shadow: 0 0 0 2px var(--color-bg-secondary);
    
    &:first-child {
      margin-left: 0;
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  position: relative;
  cursor: pointer;
  
  &:hover::after {
    content: "${props => props.name}";
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-bg-tooltip);
    color: var(--color-text-tooltip);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
  }
  
  ${props => props.isCurrentUser && `
    border: 2px solid var(--color-success);
  `}
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-success);
  border: 2px solid var(--color-bg-secondary);
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  color: ${props => props.connected ? 'var(--color-success)' : 'var(--color-danger)'};
`;

// Generate a color based on user ID/name
const generateUserColor = (id, name) => {
  const colors = [
    '#4285F4', '#DB4437', '#F4B400', '#0F9D58', // Google colors
    '#6200EA', '#2962FF', '#00BFA5', '#FFD600', // Material colors
    '#FF6D00', '#AA00FF', '#64DD17', '#304FFE', // More material colors
  ];
  
  // Use name if available, otherwise use ID
  const key = name || id || '';
  
  // Simple hash function to generate an index
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get user initials from name
const getUserInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ActiveUsers = () => {
  const { activeUsers, connected } = useCollaboration();
  const { user } = useAuth();
  
  // Limit displayed users to 5
  const displayedUsers = activeUsers.slice(0, 5);
  
  return (
    <ActiveUsersContainer>
      <AvatarGroup>
        {displayedUsers.map((activeUser) => (
          <UserAvatar 
            key={activeUser.userId}
            color={generateUserColor(activeUser.userId, activeUser.userName)}
            name={activeUser.userName || 'Unknown user'}
            isCurrentUser={activeUser.userId === user?.id}
          >
            {getUserInitials(activeUser.userName)}
            <OnlineIndicator />
          </UserAvatar>
        ))}
      </AvatarGroup>
      {activeUsers.length > 5 && (
        <div style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>
          +{activeUsers.length - 5} more
        </div>
      )}
      <ConnectionStatus connected={connected}>
        <FaCircle size={8} /> {connected ? 'Connected' : 'Disconnected'}
      </ConnectionStatus>
    </ActiveUsersContainer>
  );
};

export default ActiveUsers; 