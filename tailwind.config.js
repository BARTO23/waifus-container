/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Near-white/near-black pair from the "Redhead Waifus" poster/editorial
        // design (see index.css :root tokens) — used at various opacities for
        // borders, dimmed text, and the light-mode doc values.
        paper: '#f3f2f2',
        ink: '#201e1d',
        accent: {
          DEFAULT: '#ec3013',
          100: '#fff2ef',
          200: '#ffe0d9',
          300: '#ffc4b8',
          400: '#ff9783',
          500: '#ff563c',
          600: '#dd2b0f',
          700: '#ae1800',
          800: '#7c1405',
          900: '#4d170e',
        },
      },
      fontFamily: {
        heading: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['Archivo', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        // The app's one strong ease-out curve, shared by entrances and press feedback.
        'out-strong': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'content-fade': 'contentFade 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'ticker-scroll': 'tickerScroll 26s linear infinite',
      },
      keyframes: {
        contentFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        tickerScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
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
