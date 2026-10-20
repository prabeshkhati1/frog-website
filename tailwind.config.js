/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald Frog Green
          hover: '#059669',
          light: '#ecfdf5',
          glow: 'rgba(16, 185, 129, 0.4)'
        },
        pond: {
          DEFAULT: '#406ae4', // Electric Lake Blue
          hover: '#3b82f6',
          light: '#e2f5ff'
        },
        surface: {
          white: '#ffffff',
          gray: '#edf1f4',
          dark: '#1d1d1d',
          cardDark: '#232528'
        },
        text: {
          primary: '#1d1d1d',
          secondary: '#4d585f',
          muted: '#71717a'
        },
        border: {
          subtle: '#dde5ed',
          muted: 'rgba(221, 229, 237, 0.7)'
        },
        accent: {
          emerald: '#10b981',
          emeraldBg: 'rgba(16, 185, 129, 0.15)',
          warning: '#ff8b06',
          danger: '#f51c23'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        displayUi: ['"Inter Display"', '"Inter"', 'sans-serif'],
        mono: ['"Fragment Mono"', 'monospace']
      },
      maxWidth: {
        content: '1200px',
        wide: '1360px'
      },
      borderRadius: {
        card: '24px',
        bento: '16px',
        pill: '100px'
      }
    },
  },
  plugins: [],
}
