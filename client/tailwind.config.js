/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hoverColor: "#FFC000",
        brightColor: "#dd8036",
        backgroundColor: "#36ae9a",
        limegreen: '#32CD32',
        blue2: '#0000FF',
        chocolate: '#D2691E',
        darkmagenta: '#8B008B',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'rubik': ['Rubik', 'sans-serif'],
      },
      screens: {
        '14inch': '1536px',
        '15.6inch': '1920px',
      },
    },
  },
  plugins: [],
};
