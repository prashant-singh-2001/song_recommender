/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to your components and other source files
  // for Tailwind to scan and extract classnames from.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Tailwind's default theme configuration. You can extend or modify
  // existing properties here.
  theme: {
    extend: {
      // Both fonts are loaded from Google Fonts in src/index.css. Extending
      // (rather than overriding) keeps Tailwind's default sans/serif/mono.
      fontFamily: {
        Croissant: ["Croissant One", "cursive"],
        Raleway: ["Raleway", "sans-serif"],
      },
    },
  },
  // Define any additional Tailwind plugins you want to use here.
  plugins: [],
};
