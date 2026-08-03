/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F5",
        ink: "#221F1E",
        muted: "#8A8582",
        mutedFaint: "#B3ADA9",
        border: "#ECE7E3",
        chip: "#F0ECE9",
        primary: "#E2604A",
        primaryPressed: "#C14934",
        primaryBorder: "#B23F2C",
        primaryDarkest: "#9E3626",
        tint: "#F3E6E2",
        gold: "#C99A2E",
      },
    },
  },
  plugins: [],
};
