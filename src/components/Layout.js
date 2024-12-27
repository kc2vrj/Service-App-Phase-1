import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../hooks/useTheme';

const Layout = ({ children }) => {
  const { getColor, getSpacing, getShadow } = useTheme();

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: getColor('background.default'),
        color: getColor('text.primary')
      }}
    >
      <Navbar />
      <main 
        className="flex-grow container mx-auto"
        style={{ 
          padding: getSpacing('content'),
          marginTop: getSpacing('md')
        }}
      >
        <div 
          className="rounded-lg"
          style={{ 
            backgroundColor: getColor('background.paper'),
            boxShadow: getShadow('sm'),
            padding: getSpacing('lg')
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;