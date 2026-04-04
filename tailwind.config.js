/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nur: {
          bg: "#060e1a",
          surface: "#0a1628",
          gold: "#c3a671",
          "gold-dim": "#a08850",
          "gold-glow": "rgba(195,166,113,0.3)",
          text: "#b8c4d4",
          "text-dim": "#8a9bb5",
          "text-muted": "#5a6a7a",
          "text-faint": "#3d4f63",
          danger: "#c49090",
          "danger-bg": "rgba(180,80,80,0.08)",
        },
      },
      fontFamily: {
        display: ["Amiri", "Traditional Arabic", "serif"],
        arabic: ["Amiri", "Traditional Arabic", "serif"],
        body: ["Tajawal", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.35s ease forwards",
        "gentle-float": "gentleFloat 4s ease-in-out infinite",
        pulse3: "pulse3 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulse3: {
          "0%, 80%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
          "40%": { opacity: 1, transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
