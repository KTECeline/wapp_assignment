/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],               
        ibarra: ["Ibarra Real Nova", "serif"],         
      },
      colors: {
        pastry: {
          bg: '#FFF6F0',
          pink: '#FADADD',
          pink2: '#FCE2E0',
          gold: '#F4C27F',
        }
      }
    },
  },
  plugins: [],
}

