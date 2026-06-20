/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#0D4A2E",
        "green-mid": "#1a6b42",
        "green-light": "#2d8a57",

        gold: "#C9992A",
        "gold-light": "#E8B84B",
        "gold-pale": "#F5E6C0",

        cream: "#FAF6EE",

        "ink-dark": "#1A1208",
        "ink-mid": "#4A3B1F",
        "ink-muted": "#7A6B50",

        border: "#DDD0B0",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .65s both",
        progress: "progress linear forwards",
      },
    },
  },
  plugins: [],
}