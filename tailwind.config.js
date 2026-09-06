/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060608',
          900: '#0c0c0e',
        },
        scarlet: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'Inter', 'sans-serif'],
        body: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'scarlet-glow': '0 0 25px -5px rgba(225, 29, 72, 0.25)',
        'scarlet-glow-lg': '0 0 45px -5px rgba(225, 29, 72, 0.4)',
        'card-hover': '0 12px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      transitionTimingFunction: {
        // The app's one strong ease-out curve, shared by entrances and press feedback.
        'out-strong': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'content-fade': 'contentFade 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'heart-pop': 'heartPop 380ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        contentFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35)' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      // Gate hover effects to real hover-capable pointers so a tap on touch
      // devices can't leave a hover state "stuck" until the next tap.
      addVariant('hover-hover', '@media (hover: hover) and (pointer: fine)');
    },
  ],
};

