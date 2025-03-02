import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';
import { ThemeContext } from '../../contexts/ThemeContext';

describe('Button Component', () => {
  const renderButton = (props = {}) => {
    return render(
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: jest.fn() }}>
        <Button {...props}>Test Button</Button>
      </ThemeContext.Provider>
    );
  };

  test('renders correctly with default props', () => {
    renderButton();
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).not.toBeDisabled();
  });

  test('renders correctly with primary variant', () => {
    renderButton({ variant: 'primary' });
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('renders correctly with secondary variant', () => {
    renderButton({ variant: 'secondary' });
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('renders correctly with outline variant', () => {
    renderButton({ variant: 'outline' });
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('renders correctly with text variant', () => {
    renderButton({ variant: 'text' });
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('renders correctly with danger variant', () => {
    renderButton({ variant: 'danger' });
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('renders correctly with different sizes', () => {
    // Test small size
    renderButton({ size: 'small' });
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    
    // Cleanup and test medium size
    screen.unmount
    renderButton({ size: 'medium' });
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    
    // Cleanup and test large size
    screen.unmount
    renderButton({ size: 'large' });
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('applies fullWidth prop correctly', () => {
    renderButton({ fullWidth: true });
    const button = screen.getByText('Test Button');
    // Check for styled-component's attribute
    expect(button).toHaveAttribute('fullwidth', 'true');
  });

  test('handles disabled state correctly', () => {
    renderButton({ disabled: true });
    const button = screen.getByText('Test Button');
    expect(button).toBeDisabled();
  });

  test('displays spinner when loading', () => {
    renderButton({ loading: true });
    // Button text should not be visible when loading
    expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
    // Spinner should be rendered
    const spinnerElement = document.querySelector('div[role="status"]');
    expect(spinnerElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });
    const button = screen.getByText('Test Button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick, disabled: true });
    const button = screen.getByText('Test Button');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick, loading: true });
    
    // Spinner should be rendered instead of button text
    const spinnerElement = document.querySelector('div[role="status"]');
    expect(spinnerElement).toBeInTheDocument();
    
    // Click the button (which contains the spinner)
    const button = spinnerElement.closest('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
}); 