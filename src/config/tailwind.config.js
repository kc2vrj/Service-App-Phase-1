const themeConfig = require('./src/config/theme.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: themeConfig.colors.primary,
        secondary: themeConfig.colors.secondary,
        gray: themeConfig.colors.gray,
      },
      fontFamily: themeConfig.typography.fontFamily,
      fontSize: themeConfig.typography.fontSize,
      borderRadius: themeConfig.borderRadius,
      spacing: themeConfig.spacing,
    },
  },
  plugins: [],
}