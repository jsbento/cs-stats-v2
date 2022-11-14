/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-dark": "#0B0C17",
        "gray-light-d": "#1D1D27",
        "gray-light-l": "#262632",
        "gray-ligher-d": "#2E2F38",
        "gray-lighter-l": "#44454E",
        "gray-border": "#30303F",
      }
    },
  },
  plugins: [],
};
