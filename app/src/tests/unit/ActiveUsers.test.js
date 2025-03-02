import React from 'react';
import { render, screen } from '@testing-library/react';
import ActiveUsers from '../../components/editor/ActiveUsers';
import { renderWithProviders } from '../test-utils';

describe('ActiveUsers Component', () => {
  const mockActiveUsers = [
    { userId: 'user1', userName: 'John Doe' },
    { userId: 'user2', userName: 'Jane Smith' },
    { userId: 'user3', userName: 'Bob Johnson' },
  ];

  const mockUser = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  test('renders active users correctly', () => {
    renderWithProviders(
      <ActiveUsers />,
      {
        authValue: {
          user: mockUser,
          isAuthenticated: true,
        },
        collaborationValue: {
          activeUsers: mockActiveUsers,
          connected: true,
        }
      }
    );

    // Should display the correct number of user avatars
    const avatars = document.querySelectorAll('[data-testid^="user-avatar-"]');
    expect(avatars.length).toBe(mockActiveUsers.length);

    // Should show connected status
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  test('shows disconnected status when not connected', () => {
    renderWithProviders(
      <ActiveUsers />,
      {
        authValue: {
          user: mockUser,
          isAuthenticated: true,
        },
        collaborationValue: {
          activeUsers: mockActiveUsers,
          connected: false,
        }
      }
    );

    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  test('shows +X more text when there are more than 5 users', () => {
    const manyUsers = [
      { userId: 'user1', userName: 'User 1' },
      { userId: 'user2', userName: 'User 2' },
      { userId: 'user3', userName: 'User 3' },
      { userId: 'user4', userName: 'User 4' },
      { userId: 'user5', userName: 'User 5' },
      { userId: 'user6', userName: 'User 6' },
      { userId: 'user7', userName: 'User 7' },
    ];

    renderWithProviders(
      <ActiveUsers />,
      {
        authValue: {
          user: mockUser,
          isAuthenticated: true,
        },
        collaborationValue: {
          activeUsers: manyUsers,
          connected: true,
        }
      }
    );

    // Should display only 5 users
    const avatars = document.querySelectorAll('[data-testid^="user-avatar-"]');
    expect(avatars.length).toBe(5);

    // Should show the +2 more text (7 total - 5 displayed = 2 more)
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  test('handles no active users case', () => {
    renderWithProviders(
      <ActiveUsers />,
      {
        authValue: {
          user: mockUser,
          isAuthenticated: true,
        },
        collaborationValue: {
          activeUsers: [],
          connected: true,
        }
      }
    );

    // Should not display any avatars
    const avatars = document.querySelectorAll('[data-testid^="user-avatar-"]');
    expect(avatars.length).toBe(0);

    // Should still show connected status
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });
}); 