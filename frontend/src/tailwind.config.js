/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // CRA:
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',

    // If using Vite (instead of CRA), also include the root index.html:
    // './index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

