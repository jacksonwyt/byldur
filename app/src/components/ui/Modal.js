import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-bg-color, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: ${props => props.position === 'top' ? 'flex-start' : 'center'};
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.position === 'top' ? '4rem 1rem 1rem 1rem' : '1rem'};
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background-color: var(--bg-color);
  border-radius: 0;
  box-shadow: var(--shadow-lg);
  width: ${props => {
    switch (props.size) {
      case 'small': return '400px';
      case 'large': return '800px';
      case 'full': return '95%';
      default: return '600px'; // Medium is default
    }
  }};
  max-width: 95vw;
  max-height: ${props => props.position === 'top' ? 'calc(100vh - 8rem)' : 'calc(100vh - 2rem)'};
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-color-secondary);
  padding: 0.5rem;
  transition: color 0.2s;
  line-height: 1;
  
  &:hover {
    color: var(--text-color);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  gap: 0.75rem;
`;

/**
 * Modal component for dialogs, forms, and other content
 */
const Modal = ({
  open = false,
  onClose,
  title,
  children,
  footer,
  footerAlign = 'flex-end',
  size = 'medium', // 'small', 'medium', 'large', 'full'
  position = 'center', // 'center', 'top'
  hideCloseButton = false,
  closeOnOverlayClick = true,
  ...props
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open && onClose) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [open, onClose]);
  
  if (!open) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && onClose) {
      onClose();
    }
  };
  
  return (
    <Overlay position={position} onClick={handleOverlayClick} data-testid="modal-overlay">
      <ModalContainer size={size} position={position} {...props}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {!hideCloseButton && onClose && (
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        
        <ModalBody>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter align={footerAlign}>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;