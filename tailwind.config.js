/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['Helvetica Neue', 'sans-serif'],
      },
      colors: {
        primary: '#222',
        primaryV: '#c82032',
        primaryK: '#f7961e',
        primaryU: '#374f8a',
        textColor: '#bbb',
        textLight: '#049EF4',
        border: '#444',
      },
      width: {
        'header': '731px',
        '40': '40%',
      },
      minWidth: {
        '278': '278px',
      },
      inset: {
        '45vh': '45vh',
      },
      boxShadow: {
        'bx': '0 2px 15px #02022b33',
      }
    },
  },
  plugins: [],
}