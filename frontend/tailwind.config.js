/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Sesuaikan dengan struktur proyek
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ["Open Sans", "sans-serif"],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ["Roboto", "sans-serif"],
        inter: ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}

