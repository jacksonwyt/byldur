import React, { useState } from 'react';
import BaseLayout from './BaseLayout';
import DashboardSidebar from '../navigation/DashboardSidebar';
import DashboardHeader from '../navigation/DashboardHeader';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <BaseLayout 
      layout="dashboard"
      header={<DashboardHeader toggleSidebar={toggleSidebar} />}
      sidebar={<DashboardSidebar collapsed={sidebarCollapsed} />}
      sidebarCollapsed={sidebarCollapsed}
      showFooter={false}
    />
  );
};

export default DashboardLayout;