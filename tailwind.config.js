/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        pixel: {
          bg: '#1a1a2e',
          card: '#16213e',
          border: '#4a4a6a',
          primary: '#00f5ff',
          secondary: '#ff6b6b',
          accent: '#ffd700',
          success: '#4caf50',
          xp: '#9b59b6',
        },
      },
      animation: {
        'pixel-bounce': 'pixel-bounce 0.5s steps(4) infinite',
        'level-up': 'level-up 1s steps(8)',
        'xp-fill': 'xp-fill 0.5s ease-out',
      },
      keyframes: {
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.2)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'xp-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
      },
    },
  },
  plugins: [],
}
