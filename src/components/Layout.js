import React from 'react';
import Navigation from './Navigation';
import { GradientBackground } from './ui/gradient-background';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background antialiased">
      <GradientBackground />
      <Navigation />
      <main className="relative py-8 space-y-8">
        <div className="content-width">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;