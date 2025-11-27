/** @type {import('tailwindcss').Config} */
module.exports = {
  // Make sure NativeWind/Tailwind scans your app and component files
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 semantic colors
        primary: "#006a62",
        "on-primary": "#ffffff",
        "primary-container": "#40e0d0",
        "on-primary-container": "#006058",

        secondary: "#346760",
        "on-secondary": "#ffffff",
        "secondary-container": "#b8ede4",
        "on-secondary-container": "#3b6d66",

        tertiary: "#5b598d",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#c7c4ff",
        "on-tertiary-container": "#514f82",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        background: "#ffffff",
        "on-background": "#161d1c",
        surface: "#fcf8f8",
        "on-surface": "#1c1b1b",
        "surface-variant": "#e0e3e3",
        "on-surface-variant": "#444748",

        outline: "#747878",
        "outline-variant": "#c4c7c8",

        // Dark theme colors will be handled by NativeWind vars
      },
      // Map Tailwind font keys to the font family names you register with expo-font
      // This lets you use className="font-PlusJakartaSansSemiBold" in components.
      fontFamily: {
        // class -> font family name (must match keys used in useFonts)
        PlusJakartaSansMedium: ["Plus-Jakarta-Sans-Medium"],
        PlusJakartaSansSemiBold: ["Plus-Jakarta-Sans-SemiBold"],
        PlusJakartaSansRegular: ["Plus-Jakarta-Sans-Regular"],
        PlusJakartaSansExtraBold: ["Plus-Jakarta-Sans-ExtraBold"],
        PlusJakartaSansBold: ["Plus-Jakarta-Sans-Bold"],
        NicoMoji: ["Nico-Moji"],
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
