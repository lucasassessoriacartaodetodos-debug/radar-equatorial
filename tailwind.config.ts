import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        equatorial: {
          orange: "#FF9933",
          "orange-hover": "#E8881E",
          orange_soft: "#FFB266",
          green: "#00A651",
          "green-hover": "#009447",
          teal: "#0D9488",
          "teal-hover": "#0B7D72",
        },
        graphite: {
          950: "#0F1115",
          900: "#1A1D23",
          850: "#1E2128",
          800: "#22262E",
          750: "#262B33",
          700: "#2D323D",
          650: "#333945",
          600: "#3A3F4B",
          500: "#4B515E",
          400: "#6B7280",
          300: "#9CA3AF",
          200: "#D1D5DB",
          100: "#F8F9FA",
        },
        status: {
          success: "#10B981",
          "success-soft": "#064E3B",
          warning: "#F59E0B",
          "warning-soft": "#451A03",
          danger: "#EF4444",
          "danger-soft": "#450A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 12px -2px rgba(0,0,0,0.4), 0 2px 6px -2px rgba(0,0,0,0.3)",
        glow: "0 0 20px -2px rgba(255, 153, 51, 0.4)",
        "glow-green": "0 0 20px -2px rgba(0, 166, 81, 0.4)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "radar-sweep": "radar-sweep 4s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-elevated": "linear-gradient(180deg, #22262E 0%, #1A1D23 100%)",
      },
    },
  },
};

export default config;