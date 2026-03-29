/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: "#1e293b",
        // Premium red theme palette
        accent: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#dc2626", // Bright red accent
          600: "#b91c1c", // Business red
          700: "#991b1b", // Deep red
          800: "#7d1e1e", // Dark red primary
          900: "#7c2d12", // Very dark red-brown
        },
        // Dark theme base colors
        dark: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0f0f0f", // Near-black base
        },
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.03), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        md: "0 4px 12px 0 rgba(15, 23, 42, 0.08), 0 2px 4px 0 rgba(15, 23, 42, 0.05)",
        lg: "0 10px 40px 0 rgba(15, 23, 42, 0.15), 0 1px 3px 0 rgba(15, 23, 42, 0.05)",
        // Red-tinted shadows for dark theme
        "red-sm": "0 2px 8px rgba(220, 38, 38, 0.08)",
        "red-md": "0 6px 16px rgba(185, 28, 28, 0.12)",
        "red-lg": "0 12px 32px rgba(125, 30, 30, 0.18)",
        // Glow effects for accents
        "glow": "0 0 20px rgba(220, 38, 38, 0.15)",
        "glow-lg": "0 0 40px rgba(185, 28, 28, 0.2)",
      },
    },
  },
  plugins: [],
}
