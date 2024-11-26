/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        DarkRed: "#361518",
        LightDarkRed: "#BB3B3B",
      },
    },
  },
  plugins: [],
};
