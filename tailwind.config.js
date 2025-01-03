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
        'gradient-custom-dark': 'linear-gradient(to right, #2d2d2d 0%, #444444 50%, #333333 100%)', // 다크 모드용 색상 (bg-gray-800과 비슷한 색상)
      },
      backgroundSize: {
        custom: '300% 100%',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

