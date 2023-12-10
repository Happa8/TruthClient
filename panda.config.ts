import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          notosans: {
            value: "'Noto Sans JP', sans-serif",
          },
          mplus: {
            value: "'M PLUS 1p', sans-serif",
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
