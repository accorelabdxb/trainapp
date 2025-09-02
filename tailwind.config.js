/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        input: '#3C3C3C',
        secbg: '#181818'
      },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              fontFamily: 'Inter, sans-serif',
              h1: { fontFamily: 'Inter, sans-serif' },
              h2: { fontFamily: 'Inter, sans-serif' },
              h3: { fontFamily: 'Inter, sans-serif' },
              h4: { fontFamily: 'Inter, sans-serif' },
              h5: { fontFamily: 'Inter, sans-serif' },
              h6: { fontFamily: 'Inter, sans-serif' },
              p: { fontFamily: 'Inter, sans-serif' },
              span: { fontFamily: 'Inter, sans-serif' },
            },
          },
        }),
    },
  },
  plugins: [],
}