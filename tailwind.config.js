/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './dist/**/*.{html,js}',
    './public/**/*.{html,js}',
    './index.html',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeOutDown: {
          'from': {
            opacity: '1',
            transform: 'translateY(0px)'
          },
          'to': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeOutUp: {
          'from': {
            opacity: '1',
            transform: 'translateY(0px)'
          },
          'to': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
        // marquee2: {
        //   '0%': { transform: 'translateX(100%)' },
        //   '100%': { transform: 'translateX(0%)' },
        // }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        fadeInDown: 'fadeInDown 3s ease-out',
        fadeOutDown: 'fadeOutDown 3s ease-out',
        fadeInUp: 'fadeInUp 3s ease-out',
        fadeOutUp: 'fadeOutUp 3s ease-out',
        marquee: 'marquee 25s linear infinite'
        // marquee2: 'marquee2 25s linear infinite'
      }
    },
  },
  plugins: [],
}
