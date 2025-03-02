import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ExternalLink = styled.a`
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  color: var(--text-color-secondary);
  font-size: 1.2rem;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  font-size: 0.9rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Column>
          <Logo>Byldur</Logo>
          <p>AI-powered website builder that helps you create beautiful websites in minutes.</p>
          <SocialLinks>
            <SocialLink href="https://github.com/byldur" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialLink>
            <SocialLink href="https://twitter.com/byldur" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="mailto:info@byldur.com">
              <FaEnvelope />
            </SocialLink>
          </SocialLinks>
        </Column>
        
        <Column>
          <ColumnTitle>Navigation</ColumnTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Sign Up</FooterLink>
          <FooterLink to="/dashboard">Dashboard</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>Legal</ColumnTitle>
          <FooterLink to="/legal/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/legal/terms">Terms of Service</FooterLink>
        </Column>
      </FooterContent>
      
      <Copyright>
        © {currentYear} Byldur. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 