import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#DDEDED",
          anthracite: "#FFFFFF",
          slate: "#E2E8F0",
          mist: "#64748B",
          bone: "#0F172A",
          gold: "#E78312",
          "gold-light": "#F29A3A",
          navy: "#102B55",
          night: "#071D3F",
          steel: "#C9D1DC",
          paper: "#CFE5E6",
          soft: "#E6F3F2",
        },
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 14px 30px -16px rgba(185, 28, 28, 0.38)",
        /* Kırmızı gölge: kartlar ve paneller */
        red: "0 16px 32px -18px rgba(185, 28, 28, 0.5), 0 4px 10px -6px rgba(185, 28, 28, 0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
