/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050507',
        surface: '#0d0d12',
        plasma: '#9b5cff',
        aurora: '#22d3ee',
        mint: '#4ade80',
        ember: '#fb7185'
      },
      boxShadow: {
        glow: '0 0 50px rgba(34, 211, 238, 0.22)',
        violet: '0 20px 70px rgba(155, 92, 255, 0.25)'
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(circle at 15% 10%, rgba(34,211,238,.22), transparent 30%), radial-gradient(circle at 90% 0%, rgba(251,113,133,.16), transparent 28%), linear-gradient(135deg, #050507 0%, #101018 55%, #07070a 100%)'
      }
    }
  },
  plugins: []
};
