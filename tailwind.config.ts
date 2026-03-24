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
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      colors: {
        cream: {
          50: '#fdf8f0',
          100: '#faf0dc',
          200: '#f5e0b5',
          300: '#eec98a',
          400: '#e6b05e',
          500: '#de9940',
          600: '#c97f2e',
          700: '#a86427',
          800: '#874f26',
          900: '#6d4122',
        },
        brown: {
          50: '#fdf6ee',
          100: '#f9e8d3',
          200: '#f2cfa6',
          300: '#e9af6f',
          400: '#de8c3c',
          500: '#d47220',
          600: '#be5b16',
          700: '#9c4515',
          800: '#7d3818',
          900: '#653116',
          950: '#3a1709',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
