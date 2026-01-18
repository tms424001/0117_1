/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          400: '#4096ff',
          500: '#1677ff',
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66',
        },
        success: {
          50: '#f6ffed',
          500: '#52c41a',
          600: '#389e0d',
        },
        warning: {
          50: '#fffbe6',
          500: '#faad14',
          600: '#d48806',
        },
        error: {
          50: '#fff2f0',
          500: '#ff4d4f',
          600: '#cf1322',
        },
      },
      spacing: {
        'header': '56px',
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
      },
      zIndex: {
        'header': 100,
        'sidebar': 99,
        'modal': 1000,
        'tooltip': 1100,
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
