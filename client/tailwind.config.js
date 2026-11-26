/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cpcb: {
          good: '#00B050',
          satisfactory: '#92D050',
          moderate: '#FFD700',
          poor: '#FF9900',
          veryPoor: '#FF0000',
          severe: '#8B0000',
        },
      },
    },
  },
  plugins: [],
}
