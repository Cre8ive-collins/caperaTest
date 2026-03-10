import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3BAB22",
      },
      fontFamily: {
        sans: ["Roobert PRO", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
