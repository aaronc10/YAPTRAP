/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'OT2049': ['OT2049', 'sans-serif'],
        'OT2049-black': ['OT2049-black', 'sans-serif'],
        'OT2049-thin': ['OT2049-thin', 'sans-serif'],
        'neueMontreal': ['NeueMontreal', 'sans-serif'],
        'PPFormula': ['PPFormula', 'sans-serif'],
      },
      colors: {
        'primary': '#111315',
        'secondary': '#EAEAEA',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        listening: {
          '0%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(10.4)',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '.5'
          }
        }
      },
      animation: {
        'listening': 'listening 1.5s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      scale: {
        '140': '1.4',
      },
    },
  },
  plugins: [],
}
