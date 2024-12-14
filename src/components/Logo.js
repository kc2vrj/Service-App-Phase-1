// src/components/Logo.js
import React from 'react';
import themeConfig from '../config/theme.config';

const Logo = ({ className = "" }) => {
  const { logo } = themeConfig.branding;
  
  return (
    <img
      src={logo.path}
      alt={themeConfig.branding.companyName}
      className={`h-auto ${className}`}
      style={{ 
        width: logo.width,
        height: logo.height 
      }}
    />
  );
};

export default Logo;