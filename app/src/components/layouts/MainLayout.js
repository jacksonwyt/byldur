import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import MainNavbar from '../navigation/MainNavbar';
import Footer from '../common/Footer';

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 0;
  width: 100%;
  margin: 0 auto;
`;

const MainLayout = () => {
  const { darkMode } = useTheme();

  return (
    <MainContainer className={darkMode ? 'dark-mode' : ''}>
      <MainNavbar />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <Footer />
    </MainContainer>
  );
};

export default MainLayout; 