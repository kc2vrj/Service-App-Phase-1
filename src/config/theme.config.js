// src/config/theme.config.js
const themeConfig = {
  colors: {
    primary: {
      main: '#1b1464',
      hover: '#2d237a',
      light: '#2f2578',
      dark: '#130f4a',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#ed1c24',
      hover: '#d31118',
      light: '#ff343b',
      dark: '#b8151b',
      contrast: '#ffffff'
    }
  },
  branding: {
    companyName: 'Maytech Systems',
    companyShortName: 'Maytech',
    logo: {
      path: '/maytech-logo.jpg',
      width: '60px',
      height: 'auto'
    }
  },
  layout: {
    maxWidth: '80rem',
    containerPadding: {
      mobile: '1rem',
      tablet: '2rem',
      desktop: '4rem'
    },
    navbarHeight: '5rem',
    borderRadius: {
      base: '0.375rem',
      large: '0.5rem'
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
  }
};

export default themeConfig;