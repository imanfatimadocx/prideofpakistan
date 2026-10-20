import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#064D32', mid: '#0B6B45', light: '#5BB56B' },
        leaf: { DEFAULT: '#5BB56B', light: '#7CC78A', dark: '#2A7F45' },
        sage: '#B9DFC5',
        mint: '#E5F4E8',
        ivory: '#F7FCF8',
        slate: '#596B68',
        cream: '#EEF3EF',
        ink: { dark: '#1C332C', mid: '#596B68', muted: '#657673' },
        border: '#CFE3D6',
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
  plugins: [typography],
}

export default config