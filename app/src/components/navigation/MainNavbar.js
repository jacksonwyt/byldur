import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import useAuthApi from '../../hooks/useAuthApi';
import { Button } from '../ui';

const NavbarContainer = styled.nav`
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  
  img {
    height: 30px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover, &.active {
    color: var(--primary-color);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  button, a {
    width: 100%;
  }
`;

const MainNavbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuthApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLoginClick = () => navigate('/login');
  const handleSignupClick = () => navigate('/register');
  const handleDashboardClick = () => navigate('/dashboard');
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          <img src="/assets/byldur-logo.svg" alt="Byldur" />
          Byldur
        </Logo>
        
        <NavLinks>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/features" className={location.pathname === '/features' ? 'active' : ''}>
            Features
          </NavLink>
          <NavLink to="/templates" className={location.pathname === '/templates' ? 'active' : ''}>
            Templates
          </NavLink>
          <NavLink to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>
            Try Demo
          </NavLink>
        </NavLinks>
        
        <NavActions>
          <ThemeToggle onClick={toggleDarkMode} aria-label="Toggle theme">
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
          
          {isAuthenticated ? (
            <Button onClick={handleDashboardClick}>Dashboard</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleLoginClick}>Login</Button>
              <Button onClick={handleSignupClick}>Sign Up</Button>
            </>
          )}
        </NavActions>
        
        <MobileMenuButton onClick={toggleMenu} aria-label="Menu">
          <FaBars />
        </MobileMenuButton>
      </NavbarContent>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen}>
        <MobileMenuHeader>
          <Logo to="/">Byldur</Logo>
          <MobileMenuButton onClick={toggleMenu} aria-label="Close menu">
            <FaTimes />
          </MobileMenuButton>
        </MobileMenuHeader>
        
        <MobileNavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/templates">Templates</NavLink>
          <NavLink to="/demo">Try Demo</NavLink>
        </MobileNavLinks>
        
        <MobileActions>
          <ThemeToggle onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? ' Light Mode' : ' Dark Mode'}
          </ThemeToggle>
          
          {isAuthenticated ? (
            <Button onClick={handleDashboardClick} fullWidth>Dashboard</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleLoginClick} fullWidth>Login</Button>
              <Button onClick={handleSignupClick} fullWidth>Sign Up</Button>
            </>
          )}
        </MobileActions>
      </MobileMenu>
    </NavbarContainer>
  );
};

export default MainNavbar; 