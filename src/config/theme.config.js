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
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
    },
    layout: {
      containerPadding: '1rem',
      navbarHeight: '5rem',
      borderRadius: {
        base: '0.25rem',
        large: '0.5rem'
      }
    },
    logo: {
      pattern: {
        path: '/images/logo-pattern.svg',
        size: '400px',
        opacity: 0.05,
        angle: '-15deg',
        spacing: {
          x: '300px',
          y: '300px'
        },
        animation: {
          duration: '60s',
          enabled: true
        }
      }
    }
  };
  
  export default themeConfig;