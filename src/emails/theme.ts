import { TailwindConfig } from "react-email";

export const theme: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: "#0E4C3D",
        secondary: "#FDC003",
        accent: "#2D7A4A",

        background: "#F6F3F2",
        surface: "#FFFFFF",
        foreground: "#1B1C1C",
        muted: "#66736E",
        border: "#BFC9C4",

        success: "#2D7A4A",
        warning: "#785900",
        error: "#BA1A1A",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        sans: ["Syne", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
};
