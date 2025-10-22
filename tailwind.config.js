/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-black": "#000000",
        "brand-ice": "#F5F5F5",
        "brand-gold": "#C0A062",
        "brand-copper": "#8C3B25",
      },
      borderRadius: { "2xl": "1rem" },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        montserrat: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
