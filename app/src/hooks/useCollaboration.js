import { useContext } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';

export const useCollaboration = () => {
  return useContext(CollaborationContext);
};

export default useCollaboration; 