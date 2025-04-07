/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'], // ✅ tells Tailwind where to scan for classes
    theme: {
      extend: {
        colors: {
          primary: '#B3DAF1',
          text: '#1E293B',
          accent: '#9F8FFF',
          bg: '#F8FAFC',
        },
      },
    },
    plugins: [],
  }