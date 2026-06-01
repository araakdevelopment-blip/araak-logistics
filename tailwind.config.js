/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e6f1fb',
          100: '#cce3f7',
          200: '#99c7ef',
          300: '#66abe7',
          400: '#338fdf',
          500: '#0073d7',
          600: '#005cac',
          700: '#004581',
          800: '#002e56',
          900: '#00172b',
          950: '#000c16',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#faf0d0',
          200: '#f5e1a1',
          300: '#f0d272',
          400: '#ebc343',
          500: '#d4a017',
          600: '#aa8012',
          700: '#7f600e',
          800: '#554009',
          900: '#2a2005',
        },
        neutral: {
          50:  '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0d1117',
        },
        success: {
          50:  '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50:  '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #00172b 0%, #002e56 50%, #004581 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0073d7 0%, #004581 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ebc343 0%, #d4a017 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.14)',
        'brand': '0 8px 32px rgba(0,115,215,0.25)',
        'gold': '0 8px 32px rgba(212,160,23,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-right': 'slideRight 0.5s ease-out both',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
