export const theme = {
  // Company Information
  company: {
    name: 'Maytech Systems',
    logo: {
      main: '/images/logo.png',
      alt: 'Maytech Systems Logo',
      width: 150,
      height: 40
    },
    favicon: '/favicon.ico'
  },

  // Color Scheme
  colors: {
    // Primary Colors
    primary: {
      main: 'hsl(var(--primary))',
      light: 'hsl(var(--primary) / 0.9)',
      dark: 'hsl(var(--primary) / 1.1)',
      hover: 'hsl(var(--primary) / 0.9)',
      contrastText: '#FFFFFF'
    },
    // Secondary Colors
    secondary: {
      main: 'hsl(var(--secondary))',
      light: 'hsl(var(--secondary) / 0.9)',
      dark: 'hsl(var(--secondary) / 1.1)',
      hover: 'hsl(var(--secondary) / 0.9)',
      contrastText: '#FFFFFF'
    },
    // Background Colors
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
      card: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.7)'
    },
    // Text Colors
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#9E9E9E',
      hint: '#9E9E9E'
    },
    // Status Colors
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3'
    },
    // Border Colors
    border: {
      main: '#E0E0E0',
      light: '#F0F0F0',
      dark: '#BDBDBD'
    },
    // Dark Mode Colors
    dark: {
      background: '#000000',
      text: '#FFFFFF',
      primary: 'hsl(var(--primary) / 0.8)',
      secondary: 'hsl(var(--secondary) / 0.8)'
    }
  },

  // Typography
  typography: {
    fontFamily: {
      main: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      heading: 'inherit',
      monospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',     // 48px
    content: 'clamp(1rem, 5vw, 2rem)',
    section: 'clamp(2rem, 8vw, 4rem)'
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.375rem',  // 6px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    full: '9999px'
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },

  // Transitions
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      normal: '300ms',
      slow: '450ms'
    },
    timing: {
      base: 'ease-in-out',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Z-index
  zIndex: {
    negative: -1,
    zero: 0,
    low: 10,
    medium: 20,
    high: 30,
    nav: 50,
    modal: 100,
    tooltip: 110,
    highest: 9999
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Layout
  layout: {
    maxWidth: '1200px',
    containerPadding: '1rem',
    mobileNav: {
      width: '16rem'
    }
  },

  // Effects
  effects: {
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      blur: '10px',
      border: '1px solid rgba(255, 255, 255, 0.18)'
    },
    hover: {
      lift: 'translateY(-2px)'
    }
  },

  // Mobile Optimizations
  mobile: {
    touchTarget: {
      minHeight: '44px'
    },
    padding: {
      button: '0.75rem',
      input: '0.5rem',
      container: '1rem'
    },
    fontSize: {
      button: '0.875rem',
      input: '1rem'
    }
  }
};

// Helper functions to access theme values
export const getThemeValue = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme);
};

// CSS-in-JS helper function
export const createThemeStyles = (styles) => {
  if (typeof styles === 'function') {
    return styles(theme);
  }
  return styles;
};

// Media query helper
export const mediaQuery = (breakpoint) => {
  const width = theme.breakpoints[breakpoint];
  return `@media (min-width: ${width})`;
};
