import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#0B0C10', // Deep anthracite
        surface: '#1F2833', // Slightly lighter panel
        'surface-raised': '#2B3847', // Raised
        accent: {
          DEFAULT: '#00CECB', // Cyan-400
          light: '#00E5FF',   // Cyan hover (brighter neon)
          dark: '#00A8A5',    // Deep cyan
        },
        chrome: {
          light: '#F8FAFC',
          DEFAULT: '#E2E8F0', // silver text
          dark: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config
