import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, requireSubscription = false, requireAIAccess = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return <Spinner fullScreen message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If route requires AI access but user doesn't have it
  if (requireAIAccess && (!user.subscription || user.subscription.status !== 'active')) {
    return <Navigate to="/dashboard/subscription?required=true&aiOnly=true" replace />;
  }
  
  // Leaving the subscription check for backward compatibility, but it won't be used anymore
  // since we're making all non-AI features free
  if (requireSubscription && (!user.subscription || user.subscription.status !== 'active')) {
    return <Navigate to="/dashboard/subscription?required=true" replace />;
  }

  // Authentication passed, render the protected component
  return children;
};

export default ProtectedRoute; 