import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        cyan: "hsl(var(--cyan))",
        pink: "hsl(var(--pink))",
        gold: "hsl(var(--gold))",
        surface: "hsl(var(--surface))",
        muted: "hsl(var(--muted))",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(124,92,255,.25)",
        "glow-cyan": "0 0 40px rgba(34,211,238,.15)",
      },
      backgroundImage: {
        brand: "linear-gradient(115deg,#7C5CFF,#22D3EE)",
        "hero-mesh":
          "radial-gradient(ellipse at 70% 30%,rgba(124,92,255,.22),transparent 42%),radial-gradient(ellipse at 30% 75%,rgba(34,211,238,.1),transparent 38%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-9px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 7s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
