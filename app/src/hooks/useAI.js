import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import aiService from '../services/aiService';
import useAuthApi from './useAuthApi';

// Create context
const AIContext = createContext();

// AI Status types
export const AI_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Provider factory
export const createAIProvider = () => {
  // Return the provider component
  const AIProvider = ({ children }) => {
    const [credits, setCredits] = useState(0);
    const [usageHistory, setUsageHistory] = useState([]);
    const [status, setStatus] = useState(AI_STATUS.IDLE);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [lastOperation, setLastOperation] = useState(null);
    const { getCurrentUser, isAuthenticated } = useAuthApi();
    const [user, setUser] = useState(null);
    
    // Fetch user when authenticated
    useEffect(() => {
      if (isAuthenticated) {
        const loadUserData = async () => {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (err) {
            console.error('Error fetching user data for AI context:', err);
          }
        };
        
        loadUserData();
      }
    }, [isAuthenticated, getCurrentUser]);

    // Fetch AI credits when user is authenticated
    useEffect(() => {
      if (isAuthenticated && user) {
        fetchAICredits();
        fetchUsageHistory();
      }
    }, [isAuthenticated, user]);

    // Reset error when status changes
    useEffect(() => {
      if (status !== AI_STATUS.ERROR) {
        setError(null);
      }
    }, [status]);

    // Clear error after 10 seconds
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => setError(null), 10000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    // Helper to handle operations with proper status updates
    const handleOperation = useCallback(async (operation, operationName, statusType = AI_STATUS.LOADING) => {
      try {
        setStatus(statusType);
        setLastOperation(operationName);
        setError(null);
        const result = await operation();
        setStatus(AI_STATUS.SUCCESS);
        return result;
      } catch (err) {
        console.error(`Error during ${operationName}:`, err);
        setError(err.message || `Failed during ${operationName}`);
        setStatus(AI_STATUS.ERROR);
        throw err;
      } finally {
        if (statusType === AI_STATUS.GENERATING) {
          setGenerating(false);
        }
      }
    }, []);

    // Fetch AI credits
    const fetchAICredits = useCallback(async () => {
      return handleOperation(
        async () => {
          const data = await aiService.getCredits();
          setCredits(data.credits);
          return data.credits;
        },
        'fetch AI credits'
      );
    }, [handleOperation]);

    // Fetch usage history
    const fetchUsageHistory = useCallback(async () => {
      return handleOperation(
        async () => {
          const data = await aiService.getUsageHistory();
          setUsageHistory(data);
          return data;
        },
        'fetch AI usage history'
      );
    }, [handleOperation]);

    // Track the last generate params for retry functionality
    const [lastGenerateParams, setLastGenerateParams] = useState(null);

    // Retry last failed operation
    const retryLastOperation = useCallback(async () => {
      if (!lastOperation) return;
      
      switch (lastOperation) {
        case 'fetch AI credits':
          return fetchAICredits();
        case 'fetch AI usage history':
          return fetchUsageHistory();
        case 'generate website':
          if (lastGenerateParams?.prompt) {
            return generateWebsite(lastGenerateParams.prompt, lastGenerateParams.options);
          }
          break;
        case 'generate component':
          if (lastGenerateParams?.prompt && lastGenerateParams?.type) {
            return generateComponent(
              lastGenerateParams.prompt, 
              lastGenerateParams.type, 
              lastGenerateParams.options
            );
          }
          break;
        case 'get suggestions':
          if (lastGenerateParams?.html && lastGenerateParams?.css) {
            return getSuggestions(
              lastGenerateParams.html, 
              lastGenerateParams.css, 
              lastGenerateParams.options
            );
          }
          break;
        default:
          setError('Cannot retry the last operation');
      }
    }, [lastOperation, fetchAICredits, fetchUsageHistory, lastGenerateParams]);

    // Generate website content
    const generateWebsite = useCallback(async (prompt, options = {}) => {
      setLastGenerateParams({ prompt, options });
      setGenerating(true);
      
      return await handleOperation(
        async () => {
          const data = await aiService.generateWebsite(prompt, options);
          // Update credits after generation
          await fetchAICredits();
          await fetchUsageHistory();
          return data;
        },
        'generate website',
        AI_STATUS.GENERATING
      );
    }, [handleOperation, fetchAICredits, fetchUsageHistory]);

    // Generate component or section
    const generateComponent = useCallback(async (prompt, type, options = {}) => {
      setLastGenerateParams({ prompt, type, options });
      setGenerating(true);
      
      return await handleOperation(
        async () => {
          const data = await aiService.generateComponent(prompt, type, options);
          // Update credits after generation
          await fetchAICredits();
          await fetchUsageHistory();
          return data;
        },
        'generate component',
        AI_STATUS.GENERATING
      );
    }, [handleOperation, fetchAICredits, fetchUsageHistory]);

    // Get AI suggestions for improvements
    const getSuggestions = useCallback(async (html, css, options = {}) => {
      setLastGenerateParams({ html, css, options });
      setGenerating(true);
      
      return await handleOperation(
        async () => {
          const data = await aiService.getSuggestions(html, css, options);
          // Update credits after generation
          await fetchAICredits();
          await fetchUsageHistory();
          return data;
        },
        'get suggestions',
        AI_STATUS.GENERATING
      );
    }, [handleOperation, fetchAICredits, fetchUsageHistory]);

    // Purchase AI credits
    const purchaseCredits = useCallback(async (amount) => {
      return await handleOperation(
        async () => {
          const data = await aiService.purchaseCredits(amount);
          await fetchAICredits();
          return data;
        },
        'purchase AI credits'
      );
    }, [handleOperation, fetchAICredits]);

    const value = {
      credits,
      usageHistory,
      status,
      generating,
      error,
      fetchAICredits,
      fetchUsageHistory,
      generateWebsite,
      generateComponent,
      getSuggestions,
      purchaseCredits,
      retryLastOperation,
      setError,
      clearError: () => setError(null)
    };

    AIProvider.displayName = 'AIProvider';

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
  };

  return AIProvider;
};

// Provider component for direct usage
export const AIProvider = createAIProvider();

// Hook for consuming the AI context
const useAI = () => {
  const context = useContext(AIContext);
  
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  
  return context;
};

export { useAI };
export default useAI; 