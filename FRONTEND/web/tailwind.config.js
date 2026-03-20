/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#64748b",
        accent: "#0ea5e9",
        "background-light": "#ffffff",
        "background-dark": "#0a0a0a",
        "surface-light": "#f8fafc",
        "surface-dark": "#171717",
        "border-light": "#e2e8f0",
        "border-dark": "#262626",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ['"Google Sans"', "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem", 
        'full': '9999px',
      },
      animation: {
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float 6s ease-in-out 3s infinite',
          'float-slow': 'float 8s ease-in-out infinite',
          'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
          float: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
          }
      }
    },
  },
  plugins: [],
}
