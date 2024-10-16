/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#379245",
        background: "#D2E2D2",
      },
    },
  },
  plugins: [],
};
