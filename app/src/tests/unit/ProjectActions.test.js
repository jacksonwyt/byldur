import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProjectActions from '../../components/projects/ProjectActions';
import { renderWithProviders } from '../test-utils';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ProjectActions Component', () => {
  const projectId = 'project123';
  const mockProjectFunctions = {
    duplicateProject: jest.fn().mockResolvedValue({ id: 'duplicated123' }),
    deleteProject: jest.fn().mockResolvedValue(true),
    publishProject: jest.fn().mockResolvedValue({ id: 'project123', isPublished: true }),
    unpublishProject: jest.fn().mockResolvedValue({ id: 'project123', isPublished: false }),
    deployProject: jest.fn().mockResolvedValue({ project: {}, deployment: {} }),
    getDeploymentHistory: jest.fn().mockResolvedValue([
      { id: 'deploy1', createdAt: '2023-01-01T00:00:00Z', status: 'success', url: 'https://example.com' }
    ]),
    loading: false,
    deployments: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all action buttons', () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={false} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('Publish')).toBeInTheDocument();
    expect(screen.getByText('Deploy')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('renders correct publish/unpublish button based on isPublished', () => {
    // First render with isPublished=false
    const { unmount } = renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={false} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    expect(screen.getByText('Publish')).toBeInTheDocument();
    
    // Cleanup and render with isPublished=true
    unmount();
    
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={true} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    expect(screen.getByText('Unpublish')).toBeInTheDocument();
  });

  test('disables Deploy button if not published', () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={false} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    const deployButton = screen.getByText('Deploy').closest('button');
    expect(deployButton).toBeDisabled();
  });

  test('calls deleteProject when delete is confirmed', async () => {
    // Mock window.confirm to return true (user confirms deletion)
    const originalConfirm = window.confirm;
    window.confirm = jest.fn().mockReturnValue(true);
    
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={false} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    // Open delete modal
    fireEvent.click(screen.getByText('Delete'));
    
    // Delete modal should be visible
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    
    // Confirm delete
    fireEvent.click(screen.getByText('Delete').closest('button'));
    
    // Function should be called with project ID
    await waitFor(() => {
      expect(mockProjectFunctions.deleteProject).toHaveBeenCalledWith(projectId);
    });
    
    // Restore original window.confirm
    window.confirm = originalConfirm;
  });

  test('calls publishProject when Publish is clicked', async () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={false} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    // Click publish button
    fireEvent.click(screen.getByText('Publish'));
    
    // Function should be called with project ID
    await waitFor(() => {
      expect(mockProjectFunctions.publishProject).toHaveBeenCalledWith(projectId);
    });
  });

  test('calls unpublishProject when Unpublish is clicked', async () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={true} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    // Click unpublish button
    fireEvent.click(screen.getByText('Unpublish'));
    
    // Function should be called with project ID
    await waitFor(() => {
      expect(mockProjectFunctions.unpublishProject).toHaveBeenCalledWith(projectId);
    });
  });

  test('opens deploy modal and calls deployProject', async () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={true} />,
      {
        projectValue: {
          ...mockProjectFunctions
        }
      }
    );
    
    // Open deploy modal
    fireEvent.click(screen.getByText('Deploy'));
    
    // Deploy modal should be visible
    expect(screen.getByText('Deploy Project')).toBeInTheDocument();
    
    // Confirm deploy
    fireEvent.click(screen.getAllByText('Deploy')[1]); // Second Deploy button is in the modal
    
    // Function should be called with project ID
    await waitFor(() => {
      expect(mockProjectFunctions.deployProject).toHaveBeenCalledWith(projectId);
    });
  });

  test('shows deployment history when History is clicked', async () => {
    renderWithProviders(
      <ProjectActions projectId={projectId} isPublished={true} />,
      {
        projectValue: {
          ...mockProjectFunctions,
          deployments: [
            { 
              id: 'deploy1', 
              createdAt: '2023-01-01T00:00:00Z', 
              status: 'success', 
              url: 'https://example.com' 
            }
          ]
        }
      }
    );
    
    // Click history button
    fireEvent.click(screen.getByText('History'));
    
    // getDeploymentHistory should be called with project ID
    await waitFor(() => {
      expect(mockProjectFunctions.getDeploymentHistory).toHaveBeenCalledWith(projectId);
    });
    
    // History modal should be visible
    expect(screen.getByText('Deployment History')).toBeInTheDocument();
    
    // Deployment info should be visible
    expect(screen.getByText('Deployment 1')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });
}); 