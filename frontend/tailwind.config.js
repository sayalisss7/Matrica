/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0f',
          accent: '#7f56d9',
          light: '#f4ebff'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
