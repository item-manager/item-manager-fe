/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: '#body',
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      boxShadow: {
        1: '0px 1px 20px rgba(0, 0, 0, 0.25);',
        2: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 2px 1px rgba(0, 0, 0, 0.06), 0px 1px 1px rgba(0, 0, 0, 0.08);',
      },
      colors: {
        bkg: '#FBFBFB',
        gray: '#D3D3D3',
        lightGray: '#E8E8E8',
        main: '#2E8B57',
      },
      height: {
        46: '46px',
        471: '471px',
      },
      width: {
        210: '210px',
        430: '430px',
        518: '518px',
      },
    },
  },
  plugins: [],
}
