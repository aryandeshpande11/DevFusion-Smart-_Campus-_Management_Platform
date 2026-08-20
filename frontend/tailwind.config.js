/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // AleBaple brand palette — matches the landing page: ink/white base,
      // confident blue as the one primary color, warm gold used sparingly as
      // a seal/accent (never a second primary). sky + rose stay desaturated
      // companions for stat-tile variety only, not primary UI.
      colors: {
        ink: "#171923",
        canvas: "#F7F8FA",
        surface: "#FFFFFF",
        border: "#ECEDF1",
        muted: "#4A5568",
        brand: {
          50: "#EFF3FF",
          100: "#DCE6FF",
          300: "#93B4FA",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        gold: {
          100: "#FDF0D9",
          400: "#FDBA4C",
          600: "#B9821F",
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