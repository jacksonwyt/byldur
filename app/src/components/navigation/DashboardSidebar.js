import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthApi from '../../hooks/useAuthApi';
import { 
  FaTachometerAlt, 
  FaFolder, 
  FaFileAlt, 
  FaPaintBrush, 
  FaCreditCard, 
  FaUser, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight,
  FaSignOutAlt,
  FaPlus
} from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: ${props => props.collapsed ? '70px' : '250px'};
  background-color: var(--color-bg-secondary);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
  transition: width 0.3s ease;
  overflow-x: hidden;
  z-index: 100;
  border-right: 1px solid var(--color-border);
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 1.75rem;
  }
  
  span {
    margin-left: 0.5rem;
    display: ${props => props.collapsed ? 'none' : 'inline'};
  }
`;

const SidebarContent = styled.div`
  padding: 1rem 0;
  height: calc(100vh - 80px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 1.5rem;
    margin-bottom: 0.75rem;
    display: ${props => props.collapsed ? 'none' : 'block'};
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  &.active {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.1);
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: var(--color-primary);
    }
  }
  
  svg {
    font-size: 1.25rem;
    min-width: 1.25rem;
  }
  
  span {
    margin-left: 0.75rem;
    transition: opacity 0.2s;
    opacity: ${props => props.collapsed ? 0 : 1};
    display: ${props => props.collapsed ? 'none' : 'inline'};
    white-space: nowrap;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.25rem;
  padding: ${props => props.collapsed ? '0.75rem' : '0.75rem 1.5rem'};
  margin: 0 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  span {
    margin-left: 0.5rem;
    display: ${props => props.collapsed ? 'none' : 'inline'};
    font-weight: 500;
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  span {
    margin-left: 0.75rem;
    display: ${props => props.collapsed ? 'none' : 'inline'};
  }
`;

const DashboardSidebar = ({ collapsed }) => {
  const { user, logout } = useAuthApi();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the current active path
  const currentPath = location.pathname;
  
  // Define main navigation sections
  const navigationSections = [
    {
      title: 'Main',
      items: [
        { 
          path: '/dashboard', 
          label: 'Dashboard', 
          icon: <FaTachometerAlt /> 
        },
        { 
          path: '/dashboard/projects', 
          label: 'My Projects', 
          icon: <FaFolder /> 
        }
      ]
    },
    {
      title: 'Content',
      items: [
        { 
          path: '/dashboard/templates', 
          label: 'Templates', 
          icon: <FaPaintBrush /> 
        },
        { 
          path: '/dashboard/pages', 
          label: 'Pages', 
          icon: <FaFileAlt /> 
        }
      ]
    },
    {
      title: 'Account',
      items: [
        { 
          path: '/dashboard/profile', 
          label: 'Profile', 
          icon: <FaUser /> 
        },
        { 
          path: '/dashboard/subscription', 
          label: 'Subscription', 
          icon: <FaCreditCard /> 
        },
        { 
          path: '/dashboard/settings', 
          label: 'Settings', 
          icon: <FaCog /> 
        }
      ]
    }
  ];
  
  // Check if a path is active or one of its subpaths is active
  const isActive = (path) => {
    if (path === '/dashboard' && currentPath === '/dashboard') {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/dashboard';
  };
  
  // Handle new project button click
  const handleNewProject = () => {
    // Navigate to new project page using React Router
    navigate('/projects/new');
  };
  
  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        <Logo collapsed={collapsed}>
          <span>Byldur</span>
        </Logo>
      </SidebarHeader>
      
      <SidebarContent>
        <ActionButton 
          collapsed={collapsed}
          onClick={handleNewProject}
        >
          <FaPlus />
          <span>New Project</span>
        </ActionButton>
        
        {navigationSections.map((section, index) => (
          <SidebarSection 
            key={index} 
            collapsed={collapsed}
          >
            <h3>{section.title}</h3>
            {section.items.map((item, itemIndex) => (
              <NavItem
                key={itemIndex}
                to={item.path}
                collapsed={collapsed}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={item.path === '/dashboard'} // Only exact match for dashboard
              >
                {item.icon}
                <span>{item.label}</span>
              </NavItem>
            ))}
          </SidebarSection>
        ))}
        
        <SidebarFooter>
          <NavItem 
            as="button"
            onClick={logout} 
            collapsed={collapsed}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </NavItem>
        </SidebarFooter>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default DashboardSidebar; 