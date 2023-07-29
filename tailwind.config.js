/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./public/src/html/*.html", "./public/src/js/*.js"],
  theme: {
    extend: {
      colors: {
        'primary-color': '#EE8119',
        'secondary-color': '#F5F5F5',
        'gray-1': '#121212',
        'gray-2': '#181818',
        'gray-3': '#B3B3B3'
      },
      fontFamily: {
        formula1: ["Formula1", "sans-serif"],
      },
    },
  },
  plugins: [],
}
