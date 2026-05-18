/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#0A0E1A',
        surface: '#111827',
        border:  '#1F2937',
        profit:  '#10B981',
        danger:  '#EF4444',
        warning: '#F59E0B',
        ai:      '#3B82F6',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
