/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to your components and other source files
  // for Tailwind to scan and extract classnames from.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Tailwind's default theme configuration. You can extend or modify
  // existing properties here.
  theme: {
    extend: {},
    fontFamily: {
      // Define a custom font family named "Croissant" using the
      // "Croissant One" font from Google Fonts or a similar source.
      Croissant: ["Croissant One"],
    },
  },
  // Define any additional Tailwind plugins you want to use here.
  plugins: [],
};
