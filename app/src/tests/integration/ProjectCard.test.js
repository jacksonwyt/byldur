import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProjectCard from '../../components/projects/ProjectCard';
import { renderWithProviders } from '../test-utils';
import { mockApiResponses } from '../test-utils';

// Mock formatDate utility
jest.mock('../../utils/dateUtils', () => ({
  formatDate: jest.fn(() => 'January 1, 2023')
}));

describe('ProjectCard Component (Integration)', () => {
  const mockProject = mockApiResponses.projects[0];
  
  const mockHandlers = {
    onEdit: jest.fn(),
    onPreview: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
  };

  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
  });

  test('renders project information correctly', () => {
    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    // Check if the date is formatted and rendered
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
  });

  test('renders project thumbnail if available', () => {
    renderWithProviders(
      <ProjectCard 
        project={{ ...mockProject, thumbnail: 'thumbnail.jpg' }} 
        {...mockHandlers} 
      />
    );

    const thumbnailImage = screen.getByAltText(`${mockProject.name} thumbnail`);
    expect(thumbnailImage).toBeInTheDocument();
    expect(thumbnailImage).toHaveAttribute('src', 'thumbnail.jpg');
  });

  test('renders placeholder with initials if no thumbnail', () => {
    renderWithProviders(
      <ProjectCard 
        project={{ ...mockProject, thumbnail: null }} 
        {...mockHandlers} 
      />
    );

    // The first letter of the project name should be shown as an initial
    const firstLetter = mockProject.name.charAt(0);
    expect(screen.getByText(firstLetter)).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    const editButton = screen.getByLabelText('Edit project');
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockProject.id);
  });

  test('calls onPreview when preview button is clicked', () => {
    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    const previewButton = screen.getByLabelText('Preview project');
    fireEvent.click(previewButton);
    
    expect(mockHandlers.onPreview).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onPreview).toHaveBeenCalledWith(mockProject.id);
  });

  test('calls onDelete when delete button is clicked and confirmed', async () => {
    // Mock window.confirm to return true (user confirms deletion)
    const originalConfirm = window.confirm;
    window.confirm = jest.fn().mockReturnValue(true);

    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete project');
    fireEvent.click(deleteButton);
    
    // Confirm dialog should be shown and user confirms
    expect(window.confirm).toHaveBeenCalled();
    
    // onDelete should be called with project ID
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockProject.id);

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });

  test('does not call onDelete when delete is canceled', () => {
    // Mock window.confirm to return false (user cancels deletion)
    const originalConfirm = window.confirm;
    window.confirm = jest.fn().mockReturnValue(false);

    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete project');
    fireEvent.click(deleteButton);
    
    // Confirm dialog should be shown and user cancels
    expect(window.confirm).toHaveBeenCalled();
    
    // onDelete should not be called
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });

  test('calls onDuplicate when duplicate button is clicked', () => {
    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    const duplicateButton = screen.getByLabelText('Duplicate project');
    fireEvent.click(duplicateButton);
    
    expect(mockHandlers.onDuplicate).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onDuplicate).toHaveBeenCalledWith(mockProject.id);
  });

  test('links to project details page', () => {
    renderWithProviders(
      <ProjectCard 
        project={mockProject} 
        {...mockHandlers} 
      />
    );

    // The project title should be a link to the project details page
    const titleLink = screen.getByText(mockProject.name).closest('a');
    expect(titleLink).toHaveAttribute('href', `/projects/${mockProject.id}`);
  });
}); 