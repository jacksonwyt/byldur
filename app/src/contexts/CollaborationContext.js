import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import useAuthApi from '../hooks/useAuthApi';
import useProjectApi from '../hooks/useProjectApi';
import io from 'socket.io-client';

export const CollaborationContext = createContext();

export const CollaborationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuthApi();
  const { currentProject } = useProjectApi();
  const [activeUsers, setActiveUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [pendingChanges, setPendingChanges] = useState([]);
  const socketRef = useRef(null);
  const projectRef = useRef(null);

  // Connect to the collaboration server when a project is opened
  useEffect(() => {
    if (!isAuthenticated || !user || !currentProject) {
      return;
    }

    const projectId = currentProject.id;
    if (projectRef.current !== projectId) {
      // Disconnect from the previous project if we're switching projects
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // Connect to the collaboration server
      const socket = io(process.env.REACT_APP_API_URL, {
        path: '/collaboration',
        query: {
          projectId,
          userId: user.id,
          userName: user.name,
        },
        transports: ['websocket', 'polling'],
      });

      // Handle connection events
      socket.on('connect', () => {
        setConnected(true);
        setError(null);
        console.log('Connected to collaboration server');
      });

      socket.on('disconnect', () => {
        setConnected(false);
        console.log('Disconnected from collaboration server');
      });

      socket.on('connect_error', (err) => {
        setConnected(false);
        setError(`Connection error: ${err.message}`);
        console.error('Collaboration connection error:', err);
      });

      // Handle user presence events
      socket.on('users:update', (users) => {
        setActiveUsers(users);
      });

      // Handle changes from other users
      socket.on('changes:receive', (change) => {
        // Process incoming changes
        handleIncomingChange(change);
      });

      socketRef.current = socket;
      projectRef.current = projectId;

      // Cleanup on unmount or when project changes
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        projectRef.current = null;
        setActiveUsers([]);
        setConnected(false);
        setPendingChanges([]);
      };
    }
  }, [isAuthenticated, user, currentProject]);

  // Handle incoming changes
  const handleIncomingChange = (change) => {
    // Here you would apply the change to the editor
    // This depends on the type of change and editor implementation
    console.log('Received change:', change);
    
    // For example, with GrapesJS:
    if (window.editor && change.type === 'component') {
      // Apply component changes
      // window.editor.addComponents(change.data);
    } else if (window.editor && change.type === 'style') {
      // Apply style changes
      // window.editor.setStyle(change.data);
    }
  };

  // Send changes to other collaborators
  const sendChange = useCallback((changeData) => {
    if (!connected || !socketRef.current) {
      // Queue changes when disconnected
      setPendingChanges(prev => [...prev, changeData]);
      return false;
    }

    try {
      socketRef.current.emit('changes:send', {
        projectId: projectRef.current,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        ...changeData,
      });
      return true;
    } catch (err) {
      console.error('Error sending change:', err);
      return false;
    }
  }, [connected, user]);

  // Try to send any pending changes when connection is restored
  useEffect(() => {
    if (connected && pendingChanges.length > 0) {
      const changes = [...pendingChanges];
      setPendingChanges([]);
      
      // Attempt to send each pending change
      changes.forEach(change => {
        sendChange(change);
      });
    }
  }, [connected, pendingChanges, sendChange]);

  // Send cursor position updates
  const updateCursorPosition = useCallback((position) => {
    if (!connected || !socketRef.current) return;

    socketRef.current.emit('cursor:update', {
      projectId: projectRef.current,
      userId: user?.id,
      position,
    });
  }, [connected, user]);

  // Function to invite a user to collaborate
  const inviteCollaborator = useCallback(async (email, role = 'editor') => {
    if (!currentProject) return null;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${currentProject.id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email, role }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to invite collaborator');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error inviting collaborator:', err);
      return null;
    }
  }, [currentProject]);

  // Function to remove a collaborator
  const removeCollaborator = useCallback(async (collaboratorId) => {
    if (!currentProject) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${currentProject.id}/collaborators/${collaboratorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove collaborator');
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing collaborator:', err);
      return false;
    }
  }, [currentProject]);

  // Function to update a collaborator's permissions
  const updateCollaboratorRole = useCallback(async (collaboratorId, newRole) => {
    if (!currentProject) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${currentProject.id}/collaborators/${collaboratorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update collaborator role');
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating collaborator role:', err);
      return false;
    }
  }, [currentProject]);

  // Get collaborators for the current project
  const getCollaborators = useCallback(async () => {
    if (!currentProject) return [];
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${currentProject.id}/collaborators`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get collaborators');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error getting collaborators:', err);
      return [];
    }
  }, [currentProject]);

  return (
    <CollaborationContext.Provider
      value={{
        activeUsers,
        connected,
        error,
        sendChange,
        updateCursorPosition,
        inviteCollaborator,
        removeCollaborator,
        updateCollaboratorRole,
        getCollaborators,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export default CollaborationProvider; 