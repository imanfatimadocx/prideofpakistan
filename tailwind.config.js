/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New palette ──────────────────────────────
        green: "#064D32",          // Forest Green – logo, headings, menu
        "green-mid": "#0B6B45",
        "green-light": "#5BB56B",
        leaf: "#5BB56B",           // Fresh Leaf Green – buttons
        "leaf-light": "#7CC78A",   // button hover
        "leaf-dark": "#2A7F45",    // links / active states (readable on light backgrounds)
        sage: "#B9DFC5",           // Pastel Sage – header accent / top bar
        mint: "#E5F4E8",           // Soft Mint – light panels / sections
        ivory: "#FFFFFF",          // was Ivory #F7FCF8 – now plain white (client request)
        slate: { DEFAULT: '#596B68', deep: '#3D4D4A' },          // Slate Grey – paragraph text


        cream: "#FFFFFF",          // page background = plain white (mint is for panels)

        "ink-dark": "#1C332C",
        "ink-mid": "#596B68",
        "ink-muted": "#657673",

        border: '#DCE7E0',
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
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
  plugins: [require("@tailwindcss/typography")],
}