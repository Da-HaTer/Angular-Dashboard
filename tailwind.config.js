/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily:{
      'roboto': ['Roboto', 'sans-serif']
    },
    extend: {
      colors:{
      primary: '#5c6ac4',
      secondary: '#ecc94b',
      Tertiary: '#ed64a6',
  }},
  },
  plugins: [],
};
