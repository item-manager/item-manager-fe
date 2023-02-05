/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bkg: '#FBFBFB',
        gray: '#D3D3D3',
        main: '#2E8B57',
      },
      boxShadow: {
        1: '0px 1px 20px rgba(0, 0, 0, 0.25);',
      },
      width: {
        210: '210px',
        430: '430px',
        518: '518px',
      },
      height: {
        46: '46px',
        471: '471px',
      },
    },
  },
  plugins: [],
}
