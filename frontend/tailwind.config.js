/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyber-modern color palette
        cyber: {
          50: '#0a0a0f',
          100: '#0f0f1e',
          200: '#1a1a2e',
          300: '#16213e',
          400: '#0e3460',
          500: '#00d4ff',
          600: '#00b8e6',
          700: '#008fb3',
          800: '#006680',
          900: '#003d4d',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#a855f7',
          pink: '#f472b6',
          green: '#22d3ee',
          yellow: '#fbbf24',
        },
        dark: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        }
      },
      fontFamily: {
        'cyber': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px theme(colors.neon.blue), 0 0 10px theme(colors.neon.blue), 0 0 15px theme(colors.neon.blue)',
          },
          '100%': {
            boxShadow: '0 0 10px theme(colors.neon.blue), 0 0 20px theme(colors.neon.blue), 0 0 30px theme(colors.neon.blue)',
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}