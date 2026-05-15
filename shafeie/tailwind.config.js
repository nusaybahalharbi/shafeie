/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium dark palette
        d: {
          bg: "#0a0e17",
          surface: "#111827",
          card: "#151d2e",
          border: "rgba(195,166,113,0.12)",
          gold: "#c8a96e",
          "gold-soft": "rgba(200,169,110,0.15)",
          text: "#e2ddd5",
          "text-dim": "#9ca3af",
          "text-muted": "#6b7280",
        },
        // Premium light palette
        l: {
          bg: "#faf8f5",
          surface: "#ffffff",
          card: "#ffffff",
          border: "rgba(120,90,50,0.1)",
          gold: "#8b6914",
          "gold-soft": "rgba(139,105,20,0.08)",
          text: "#1a1612",
          "text-dim": "#5c5347",
          "text-muted": "#9c9082",
        },
      },
      fontFamily: {
        quran: ["Scheherazade New", "Amiri", "serif"],
        display: ["Amiri", "serif"],
        body: ["Tajawal", "sans-serif"],
        en: ["Outfit", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        glow: { "0%": { boxShadow: "0 0 20px rgba(200,169,110,0.1)" }, "100%": { boxShadow: "0 0 40px rgba(200,169,110,0.2)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
