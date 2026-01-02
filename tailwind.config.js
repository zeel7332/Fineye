/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#1e40af', // Blue-800
        secondary: '#eff6ff', // Blue-50
      }
    },
  },
  plugins: [],
}
