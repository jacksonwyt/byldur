import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';

// Base container for all layouts
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: ${props => props.layout === 'dashboard' ? 'row' : 'column'};
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

// Sidebar container (used in dashboard layout)
const Sidebar = styled.aside`
  width: ${props => props.collapsed ? '70px' : '250px'};
  height: 100vh;
  overflow-y: auto;
  background-color: var(--sidebar-bg-color, var(--card-bg-color));
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  display: ${props => props.visible ? 'block' : 'none'};
`;

// Header container
const Header = styled.header`
  width: 100%;
  background-color: var(--header-bg-color, var(--card-bg-color));
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
`;

// Main content area
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: ${props => props.layout === 'dashboard' && !props.sidebarCollapsed ? 'calc(100% - 250px)' : 
                    props.layout === 'dashboard' && props.sidebarCollapsed ? 'calc(100% - 70px)' : '100%'};
  max-width: ${props => props.layout === 'dashboard' && !props.sidebarCollapsed ? 'calc(100vw - 250px)' : 
                        props.layout === 'dashboard' && props.sidebarCollapsed ? 'calc(100vw - 70px)' : '100vw'};
  transition: width 0.3s ease, max-width 0.3s ease;
  overflow-x: hidden;
`;

// Content with padding
const ContentArea = styled.div`
  padding: ${props => props.noPadding ? '0' : '2rem'};
  flex: 1;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: ${props => props.noPadding ? '0' : '1rem'};
  }
`;

// Side panel (used in editor layout)
const SidePanel = styled.aside`
  width: ${props => props.open ? props.width || '350px' : '0'};
  height: 100%;
  overflow-y: auto;
  background-color: var(--panel-bg-color, var(--card-bg-color));
  border-left: ${props => props.open ? '1px solid var(--border-color)' : 'none'};
  transition: width 0.3s ease;
`;

// Footer container
const Footer = styled.footer`
  width: 100%;
  background-color: var(--footer-bg-color, var(--card-bg-color));
  border-top: 1px solid var(--border-color);
  display: ${props => props.visible ? 'block' : 'none'};
`;

/**
 * Configurable base layout that can be used for all layout types
 */
const BaseLayout = ({ 
  layout = 'main', // 'main', 'dashboard', or 'editor'
  header = null,
  sidebar = null,
  footer = null,
  sidePanel = null,
  sidePanelOpen = false,
  sidePanelWidth = '350px',
  sidebarCollapsed = false,
  noPadding = false,
  showFooter = true,
  showSidebar = true,
  showHeader = true,
  children = null
}) => {
  const { darkMode } = useTheme();

  return (
    <Container className={darkMode ? 'dark-mode' : ''} layout={layout}>
      {/* Sidebar - only shown in dashboard layout */}
      {layout === 'dashboard' && showSidebar && (
        <Sidebar collapsed={sidebarCollapsed} visible={showSidebar}>
          {sidebar}
        </Sidebar>
      )}
      
      <MainContent layout={layout} sidebarCollapsed={sidebarCollapsed}>
        {/* Header */}
        {showHeader && (
          <Header>
            {header}
          </Header>
        )}
        
        {/* Main content with optional side panel */}
        {layout === 'editor' ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <ContentArea noPadding={noPadding}>
              {children || <Outlet />}
            </ContentArea>
            <SidePanel open={sidePanelOpen} width={sidePanelWidth}>
              {sidePanel}
            </SidePanel>
          </div>
        ) : (
          <ContentArea noPadding={noPadding}>
            {children || <Outlet />}
          </ContentArea>
        )}
        
        {/* Footer - not shown in editor layout */}
        {layout !== 'editor' && showFooter && (
          <Footer visible={showFooter}>
            {footer}
          </Footer>
        )}
      </MainContent>
    </Container>
  );
};

export default BaseLayout;