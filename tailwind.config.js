module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        'ryme-black': '#121212', // Near-black for elegance
        'ryme-gold': '#D4AF37', // Luxurious gold accent
        'ryme-beige': '#F5F5DC', // Soft off-white/beige
      },
      fontFamily: {
        // Use system fonts that evoke luxury/serif style for display and a clean sans-serif for body
        'display': ['Playfair Display', 'serif'], // Placeholder for a high-end serif
        'body': ['Montserrat', 'sans-serif'], // Placeholder for a modern, clean sans-serif
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      }
    },
  },
  plugins: [],
}