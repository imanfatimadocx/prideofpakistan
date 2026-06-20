import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#0D4A2E',
          mid: '#1a6b42',
          light: '#2d8a57',
        },
        gold: {
          DEFAULT: '#C9992A',
          light: '#E8B84B',
          pale: '#F5E6C0',
        },
        cream: '#FAF6EE',
        ink: {
          dark: '#1A1208',
          mid: '#4A3B1F',
          muted: '#7A6B50',
        },
        border: '#DDD0B0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .65s both',
        progress: 'progress linear forwards',
      },
    },
  },
  plugins: [],
}

export default config