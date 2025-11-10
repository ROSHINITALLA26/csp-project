/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FAD1E6',
          peach: '#FFD8CC',
          mint: '#CFF5E7',
          blue: '#D7E9FF',
          purple: '#E6D6FF',
          glow: '#FFE8F6'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem'
      }
    }
  },
  plugins: []
}
