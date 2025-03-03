import React from 'react';
import BaseLayout from './BaseLayout';
import MainNavbar from '../navigation/MainNavbar';
import Footer from '../common/Footer';

const MainLayout = () => {
  return (
    <BaseLayout 
      layout="main"
      header={<MainNavbar />}
      footer={<Footer />}
    />
  );
};

export default MainLayout;