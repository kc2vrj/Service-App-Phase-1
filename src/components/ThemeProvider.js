import React, { useEffect } from 'react';
import themeConfig from '../config/theme.config';

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Colors
    Object.entries(themeConfig.colors).forEach(([key, values]) => {
      Object.entries(values).forEach(([subKey, value]) => {
        root.style.setProperty(`--color-${key}-${subKey}`, value);
      });
    });

    // Typography
    root.style.setProperty('--font-family-base', themeConfig.typography.fontFamily);

    // Layout
    root.style.setProperty('--container-padding', themeConfig.layout.containerPadding);
    root.style.setProperty('--navbar-height', themeConfig.layout.navbarHeight);
    root.style.setProperty('--border-radius-base', themeConfig.layout.borderRadius.base);
    root.style.setProperty('--border-radius-lg', themeConfig.layout.borderRadius.large);

    // Logo Pattern
    const { pattern } = themeConfig.logo;
    root.style.setProperty('--logo-background-image', `url(${pattern.path})`);
    root.style.setProperty('--logo-background-size', pattern.size);
    root.style.setProperty('--logo-opacity', pattern.opacity.toString());
    root.style.setProperty('--logo-angle', pattern.angle);
    root.style.setProperty('--logo-spacing-x', pattern.spacing.x);
    root.style.setProperty('--logo-spacing-y', pattern.spacing.y);
    root.style.setProperty('--logo-animation-duration', pattern.animation.duration);
    root.style.setProperty('--logo-animation-enabled', pattern.animation.enabled ? '1' : '0');
  }, []);

  return <div className="theme-provider">{children}</div>;
};

export default ThemeProvider;