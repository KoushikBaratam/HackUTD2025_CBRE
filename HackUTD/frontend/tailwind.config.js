/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cbre-green': '#003d26',
        'cbre-green-light': '#005a3d',
        'cbre-gray': '#666666',
        'cbre-gray-light': '#F5F5F5',
      },
    },
  },
  plugins: [],
}

