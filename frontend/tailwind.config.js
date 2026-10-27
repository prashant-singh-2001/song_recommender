/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
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
  plugins: [],
};
