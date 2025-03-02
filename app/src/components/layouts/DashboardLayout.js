import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import DashboardSidebar from '../navigation/DashboardSidebar';
import DashboardHeader from '../navigation/DashboardHeader';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 250px);
  transition: max-width 0.3s ease;

  @media (max-width: 768px) {
    max-width: 100vw;
  }
`;

const ContentArea = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DashboardLayout = () => {
  const { darkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <DashboardContainer className={darkMode ? 'dark-mode' : ''}>
      <DashboardSidebar collapsed={sidebarCollapsed} />
      <MainContent style={{ maxWidth: sidebarCollapsed ? 'calc(100vw - 70px)' : 'calc(100vw - 250px)' }}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardLayout; 