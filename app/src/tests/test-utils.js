import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';
import { AIContext } from '../contexts/AIContext';
import { StripeContext } from '../contexts/StripeContext';
import { CollaborationContext } from '../contexts/CollaborationContext';
import { AnalyticsContext } from '../contexts/AnalyticsContext';

// Custom renderer with providers
export const renderWithProviders = (
  ui,
  {
    themeValue = {
      theme: 'light',
      toggleTheme: jest.fn(),
    },
    authValue = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      updateProfile: jest.fn(),
      checkAuth: jest.fn().mockResolvedValue(true),
    },
    projectValue = {
      projects: [],
      currentProject: null,
      loading: false,
      error: null,
      fetchProjects: jest.fn(),
      getProject: jest.fn(),
      createProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      setCurrentProject: jest.fn(),
    },
    aiValue = {
      prompt: '',
      response: null,
      history: [],
      isProcessing: false,
      error: null,
      setPrompt: jest.fn(),
      sendPrompt: jest.fn(),
      clearPrompt: jest.fn(),
      clearResponse: jest.fn(),
      clearHistory: jest.fn(),
    },
    stripeValue = {
      loading: false,
      subscriptionStatus: null,
      plans: [],
      error: null,
      fetchSubscriptionStatus: jest.fn(),
      fetchAvailablePlans: jest.fn(),
      createCheckoutSession: jest.fn(),
      fetchCustomerPortalUrl: jest.fn(),
    },
    collaborationValue = {
      activeUsers: [],
      connected: false,
      error: null,
      sendChange: jest.fn(),
      updateCursorPosition: jest.fn(),
      inviteCollaborator: jest.fn(),
      removeCollaborator: jest.fn(),
      updateCollaboratorRole: jest.fn(),
      getCollaborators: jest.fn(),
    },
    analyticsValue = {
      trackPageView: jest.fn(),
      trackSignIn: jest.fn(),
      trackSignUp: jest.fn(),
      trackSignOut: jest.fn(),
      trackPasswordReset: jest.fn(),
      trackFeatureUsage: jest.fn(),
      trackProjectCreated: jest.fn(),
      trackProjectUpdated: jest.fn(),
      trackProjectDeleted: jest.fn(),
      trackProjectPublished: jest.fn(),
      trackProjectUnpublished: jest.fn(),
      trackProjectDeployed: jest.fn(),
      trackProjectDuplicated: jest.fn(),
      trackEditorOpened: jest.fn(),
      trackComponentAdded: jest.fn(),
      trackComponentDeleted: jest.fn(),
      trackStyleChanged: jest.fn(),
      trackContentSaved: jest.fn(),
      trackAIPromptSent: jest.fn(),
      trackAIResponseApplied: jest.fn(),
      trackSubscriptionViewed: jest.fn(),
      trackSubscriptionStarted: jest.fn(),
      trackSubscriptionChanged: jest.fn(),
      trackSubscriptionCancelled: jest.fn(),
      trackPaymentFailed: jest.fn(),
      trackError: jest.fn(),
      trackTiming: jest.fn(),
      trackCustomEvent: jest.fn(),
    },
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ThemeContext.Provider value={themeValue}>
          <AuthContext.Provider value={authValue}>
            <ProjectContext.Provider value={projectValue}>
              <AIContext.Provider value={aiValue}>
                <StripeContext.Provider value={stripeValue}>
                  <CollaborationContext.Provider value={collaborationValue}>
                    <AnalyticsContext.Provider value={analyticsValue}>
                      {children}
                    </AnalyticsContext.Provider>
                  </CollaborationContext.Provider>
                </StripeContext.Provider>
              </AIContext.Provider>
            </ProjectContext.Provider>
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock API responses
export const mockApiResponses = {
  user: {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    plan: 'basic',
  },
  projects: [
    {
      id: 'project1',
      name: 'Test Project 1',
      description: 'Project description',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      thumbnail: 'thumbnail.jpg',
    },
    {
      id: 'project2',
      name: 'Test Project 2',
      description: 'Another project',
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-04T00:00:00.000Z',
      thumbnail: 'thumbnail2.jpg',
    },
  ],
  templates: [
    {
      id: 'template1',
      name: 'Business Template',
      description: 'A template for business websites',
      thumbnail: 'business.jpg',
      category: 'business',
    },
    {
      id: 'template2',
      name: 'Portfolio Template',
      description: 'A template for portfolio websites',
      thumbnail: 'portfolio.jpg',
      category: 'portfolio',
    },
  ],
  plans: [
    {
      id: 'plan_basic',
      name: 'Basic',
      price: 9.99,
      features: ['Feature 1', 'Feature 2'],
    },
    {
      id: 'plan_pro',
      name: 'Professional',
      price: 19.99,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    },
  ],
  collaborators: [
    {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'owner',
    },
    {
      id: 'user456',
      name: 'Collaborator One',
      email: 'collab1@example.com',
      role: 'editor',
    },
    {
      id: 'user789',
      name: 'Collaborator Two',
      email: 'collab2@example.com',
      role: 'viewer',
    },
  ],
}; 