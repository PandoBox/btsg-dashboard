import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0B14",
        mint: { DEFAULT: "#5EEAD4", dim: "rgba(94,234,212,0.12)" },
        "white-4":  "rgba(255,255,255,0.04)",
        "white-6":  "rgba(255,255,255,0.06)",
        "white-8":  "rgba(255,255,255,0.08)",
        "white-12": "rgba(255,255,255,0.12)",
        "white-60": "rgba(255,255,255,0.60)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backdropBlur: { glass: "40px" },
      boxShadow: {
        glass:    "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-lg":"0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
        "glow-mint":"0 0 24px rgba(94,234,212,0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
