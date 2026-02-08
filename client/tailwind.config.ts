/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFCE1A',
        'secondary': '#0D0842',
        'blackBG': '#F3F3F3',
        'Favorite': '#FF5841'
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
    fontFamily: {
      'primary': [ "Montserrat", "sans-serif" ],
      'secondary': [ "Nunito Sans", "sans-serif" ]
    }
  },
  plugins: [],
};