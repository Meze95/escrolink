/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // 👈 Important for Angular
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#1e1b4b',
          900: '#312e81',
          800: '#3730a3',
        }
      }
    },
  },
  plugins: [],
}