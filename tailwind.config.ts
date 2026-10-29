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
        accessible: {
          green: "#0d5f2c",
          yellow: "#854d0e",
          red: "#991b1b",
          blue: "#1e40af",
        },
      },
    },
  },
  plugins: [],
};

export default config;
