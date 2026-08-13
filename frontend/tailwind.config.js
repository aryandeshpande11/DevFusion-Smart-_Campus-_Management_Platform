/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // campus brand palette — deep academic green + muted gold seal accent,
      // kept away from the generic indigo/violet SaaS default
      colors: {
        ink: "#14231F",
        canvas: "#F6F7F3",
        surface: "#FFFFFF",
        border: "#E1E4DD",
        muted: "#5B6660",
        brand: {
          50: "#EAF3EF",
          100: "#CFE4DA",
          300: "#6FA890",
          500: "#1F6F54",
          600: "#195A44",
          700: "#134534",
        },
        gold: {
          100: "#F3E6C5",
          400: "#C89B3C",
          600: "#9C7728",
        },
        danger: "#C1443B",
        success: "#2B7A4B",
        warning: "#B8842A",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 35, 31, 0.06), 0 1px 0 rgba(20, 35, 31, 0.04)",
      },
    },
  },
  plugins: [],
};
