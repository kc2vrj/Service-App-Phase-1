import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen logo-background">
      <Navigation />
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;