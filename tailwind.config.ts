import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Helvetica Neue"', "Arial", "sans-serif"],
        display: ['var(--font-display)', 'var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(15, 23, 42, 0.08)"
      },
      colors: {
        surface: "var(--bg)",
        "surface-subtle": "var(--bg-subtle)",
        "surface-elevated": "var(--bg-elevated)",
        foreground: "var(--fg)",
        "foreground-muted": "var(--fg-muted)",
        "foreground-subtle": "var(--fg-subtle)",
        "border-base": "var(--border)",
        "border-strong": "var(--border-strong)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)"
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        "pulse-ring": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(1.6)", opacity: "0" }
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" }
        },
        "soft-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(10px,-14px,0) rotate(1deg)" }
        },
        "dashboard-pulse": {
          "0%, 100%": { opacity: "0.65", transform: "scaleX(0.92)" },
          "50%": { opacity: "1", transform: "scaleX(1)" }
        },
        scanline: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(100%)" }
        },
        "cta-shimmer": {
          from: { transform: "translateX(-120%) skewX(-18deg)" },
          to: { transform: "translateX(220%) skewX(-18deg)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 500ms ease-out both",
        "scale-in": "scale-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left": "slide-in-left 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "slide-in-right 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "soft-drift": "soft-drift 7s ease-in-out infinite",
        "dashboard-pulse": "dashboard-pulse 2.4s ease-in-out infinite",
        scanline: "scanline 4.5s linear infinite",
        "cta-shimmer": "cta-shimmer 3.2s ease-in-out infinite"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
