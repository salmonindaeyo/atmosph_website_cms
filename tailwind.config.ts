import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: "#475AA8",
      secondary: "#5168B0",
      white: "#FFFFFF",
      black: "#231f20",
      blue: {
        50: "#edeff6",
        100: "#c6cce4",
        200: "#aab3d7",
        300: "#8490c5",
        400: "#6c7bb9",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "30px",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "2001px",
    },
    keyframes: {
      circle: {
        "0%": { transform: "rotate(350deg)" },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
     
     
      "line-mobile": {
        "0%": { width: "0%" },
        "100%": { width: "50%" },
      },
      "line-number": {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
      "rotate-45": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(45deg)" },
      },
      "rotate-0": {
        "0%": { transform: "rotate(45deg)" },
        "100%": { transform: "rotate(0deg)" },
      },
      "height-100": {
        "0%": { height: "0%" },
        "100%": { height: "100%" },
      },
      "height-0": {
        "0%": { height: "100%" },
        "100%": { height: "0%" },
      },
      "width-100": {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
      "rotate-full": {
        to: { transform: "rotate(360deg)" },
      },
    },
    animation: {
      circle: "circle 1s ease-in-out",
      bg: "bg 1s ease-in-out 2s forwards;",
      star1: "star 1s ease-in-out 1.5s forwards",
      star2: "star 1s ease-in-out 2s forwards",
      "fade-in-logo": "fade-in-right 1s ease-in-out 2.5s forwards",
      "fade-up": "fade-up 1s ease-in-out 3s forwards",
      line: "line 1s ease-in-out 3.5s forwards",
      "fade-up-half": "fade-up-half 1.5s ease-in-out 4s forwards",
      "fade-down-half": "fade-down-half 1.5s ease-in-out 4s forwards",
      "fade-up-content2-1": "fade-up 1s ease-in-out 5s forwards",
      "fade-up-content2-2": "fade-up 1s ease-in-out 5.5s forwards",
      "fade-up-content2-3": "fade-up 1s ease-in-out 6s forwards",
      "circle-blue-mobile": "circle-blue-mobile 1s ease-in-out",
      "circle-white-mobile": "circle-white-mobile 1.5s ease-in-out",
      "line-mobile": "line-mobile 1s ease-in-out 3.5s forwards",
      "line-number": "line-number 5s linear",
      "rotate-0": "rotate-0 0.4s ease-in-out forwards",
      "rotate-45": "rotate-45 0.4s ease-in-out forwards",
      "height-0": "height-0 0.4s ease-in-out forwards",
      "height-100": "height-100 0.4s ease-in-out forwards",
      "width-100": "width-100 0.4s ease-in-out forwards",
      "rotate-full": "rotate-full 15s linear infinite",
    },
  },
  plugins: [],
};
export default config;
