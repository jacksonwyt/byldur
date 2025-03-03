import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaBars, 
  FaUser, 
  FaBell, 
  FaSun, 
  FaMoon, 
  FaSignOutAlt, 
  FaCog,
  FaChevronDown 
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import useAuthApi from '../../hooks/useAuthApi';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: var(--color-text-secondary);
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-right: 1rem;
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: var(--color-text-secondary);
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  position: relative;
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-error);
`;

const UserSection = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
  text-align: left;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--color-bg-card);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 100;
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-text-secondary);
  }
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  &.danger {
    color: var(--color-error);
    
    svg {
      color: var(--color-error);
    }
    
    &:hover {
      background-color: rgba(var(--color-error-rgb), 0.05);
    }
  }
`;

const ButtonDropdownItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-text-secondary);
  }
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  &.danger {
    color: var(--color-error);
    
    svg {
      color: var(--color-error);
    }
    
    &:hover {
      background-color: rgba(var(--color-error-rgb), 0.05);
    }
  }
`;

// Map route paths to titles
const routeTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/projects': 'My Projects',
  '/dashboard/templates': 'Templates',
  '/dashboard/pages': 'Pages',
  '/dashboard/profile': 'Profile',
  '/dashboard/subscription': 'Subscription',
  '/dashboard/settings': 'Settings'
};

const DashboardHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuthApi();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get current page title
  const currentPageTitle = routeTitles[location.pathname] || 'Dashboard';
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Handle user logout
  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };
  
  return (
    <HeaderContainer>
      <LeftSection>
        <ToggleButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </ToggleButton>
        <PageTitle>{currentPageTitle}</PageTitle>
      </LeftSection>
      
      <RightSection>
        <IconButton onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        
        <IconButton aria-label="Notifications">
          <FaBell />
          {hasNotifications && <NotificationBadge />}
        </IconButton>
        
        <UserSection ref={dropdownRef}>
          <UserButton 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="User menu"
          >
            <UserAvatar>{getUserInitials()}</UserAvatar>
            <UserInfo>
              <UserName>{user?.name || 'User'}</UserName>
              <UserRole>{user?.role || 'Member'}</UserRole>
            </UserInfo>
            <FaChevronDown />
          </UserButton>
          
          <Dropdown isOpen={isDropdownOpen}>
            <DropdownHeader>
              <UserName>{user?.name || 'User'}</UserName>
              <UserRole>{user?.email || 'user@example.com'}</UserRole>
            </DropdownHeader>
            
            <DropdownItem to="/dashboard/profile">
              <FaUser />
              Profile
            </DropdownItem>
            
            <DropdownItem to="/dashboard/settings">
              <FaCog />
              Settings
            </DropdownItem>
            
            <ButtonDropdownItem 
              onClick={handleLogout}
              className="danger"
            >
              <FaSignOutAlt />
              Logout
            </ButtonDropdownItem>
          </Dropdown>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default DashboardHeader; 