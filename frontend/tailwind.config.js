/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // campus brand palette — deep academic green + muted gold seal accent,
      // kept away from the generic indigo/violet SaaS default. sky + rose are
      // desaturated companions used only for stat-tile variety, not primary UI.
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
        sky: {
          50: "#EAF1F5",
          100: "#D2E2EA",
          500: "#3E7C97",
          600: "#2F6178",
        },
        rose: {
          50: "#F6ECE9",
          100: "#EAD3CC",
          500: "#B65C4E",
          600: "#95493D",
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
        pop: "0 12px 24px -8px rgba(20, 35, 31, 0.18)",
      },
    },
  },
  plugins: [],
};
