// src/components/ThemeProvider.js
import React, { useEffect } from 'react';
import themeConfig from '../config/theme.config';

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Set color variables
    Object.entries(themeConfig.colors).forEach(([colorKey, colorValues]) => {
      Object.entries(colorValues).forEach(([key, value]) => {
        root.style.setProperty(`--color-${colorKey}-${key}`, value);
      });
    });

    // Set typography variables
    root.style.setProperty('--typography-font-family', themeConfig.typography.fontFamily);

    // Set layout variables
    root.style.setProperty('--layout-max-width', themeConfig.layout.maxWidth);
    root.style.setProperty('--layout-navbar-height', themeConfig.layout.navbarHeight);
    root.style.setProperty('--layout-container-padding', themeConfig.layout.containerPadding.desktop);

    // Set responsive padding
    const setResponsivePadding = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      if (width < 640) {
        root.style.setProperty('--layout-container-padding', themeConfig.layout.containerPadding.mobile);
      } else if (width < 1024) {
        root.style.setProperty('--layout-container-padding', themeConfig.layout.containerPadding.tablet);
      } else {
        root.style.setProperty('--layout-container-padding', themeConfig.layout.containerPadding.desktop);
      }
    };

    setResponsivePadding();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', setResponsivePadding);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', setResponsivePadding);
      }
    };
  }, []);

  return <div className="theme-provider">{children}</div>;
};

export default ThemeProvider; // Note: exporting as default