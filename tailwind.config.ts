import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f8fafc",
        sky: "#dbeafe",
        accent: "#0f766e"
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
