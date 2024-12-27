import { useContext } from 'react';
import { theme, getThemeValue } from '../config/theme';

export const useTheme = () => {
  // Return theme object and helper functions
  return {
    theme,
    // Get a specific theme value using dot notation
    // Example: getValue('colors.primary.main')
    getValue: getThemeValue,
    
    // Helper function to get color values
    getColor: (path) => getThemeValue(`colors.${path}`),
    
    // Helper function to get spacing values
    getSpacing: (key) => getThemeValue(`spacing.${key}`),
    
    // Helper function to get typography values
    getTypography: (path) => getThemeValue(`typography.${path}`),
    
    // Helper function to get breakpoint values
    getBreakpoint: (key) => getThemeValue(`breakpoints.${key}`),
    
    // Helper function to get shadow values
    getShadow: (key) => getThemeValue(`shadows.${key}`),
    
    // Helper function to get border radius values
    getBorderRadius: (key) => getThemeValue(`borderRadius.${key}`),
    
    // Helper function to get company info
    getCompanyInfo: (path) => getThemeValue(`company.${path}`)
  };
};
