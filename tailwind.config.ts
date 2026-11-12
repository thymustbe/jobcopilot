import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        darkBg: "#09090b",
        darkSurface: "#121215",
        darkBorder: "#27272a",
        lightBg: "#fcfcfd",
        lightSurface: "#ffffff",
        lightBorder: "#e4e4e7",
      },
    },
  },
  plugins: [],
};

export default config;
