// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      "./src/layouts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          bgStart: '#3a8d8f',      // gradient start
          bgEnd:   '#37c78d',      // gradient end
          sidebar: '#2e2e2e',      // dark charcoal
          surface: '#f6fbf8',      // light mint
          primary: '#00ac9a',      // teal accent
          accent:  '#ffcc9e',      // peach accent
          text:    '#333333',      // default text
        },
        fontFamily: {
          heading: ['"Playfair Display"', 'serif'],
          body:    ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
}
  