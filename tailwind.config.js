/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
primary: "rgba(21, 21, 21, 1)",
        secondary: "rgba(70, 81, 101, 0.844)",
        ratingBox:"rgb(71, 77, 87)",
        searchBar:"rgb(43, 49, 57)",
        darkAccent:"rgba(0, 0, 0, 0.9)",
        textMain:"rgb(132, 142, 156)",
        textAccent:"rgb(24, 26, 32)",
        textSecondary:"rgb(183, 189, 198)",      },
    },
    fontFamily: {
        heading: ["Michroma_400Regular"],
        body: ["Inter_400Regular"],
        bold: ["Inter_700Bold"],
        display: ["Bungee"],
      },
  },
  plugins: [],
};