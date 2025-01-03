/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200%' },
          '100%': { backgroundPosition: '-200%' },
        },
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #ececec 0%, #f0f0f0 50%, #e6e6e6 100%)',
      },
      backgroundSize: {
        custom: '300% 100%',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

