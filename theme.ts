import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

// Function to get CSS variable value and convert RGB to hex
function getCSSVariable(name: string, isDark = false): string {
  if (typeof document !== "undefined") {
    // Web environment - read from CSS variables
    const root = document.documentElement;
    if (isDark) {
      // Temporarily apply dark class to read dark values
      root.classList.add("dark");
      const rgbValue = getComputedStyle(root).getPropertyValue(name).trim();
      root.classList.remove("dark");
      return rgbToHex(rgbValue);
    }
    const rgbValue = getComputedStyle(root).getPropertyValue(name).trim();
    return rgbToHex(rgbValue);
  }

  // Native environment - return default values
  const lightDefaults: Record<string, string> = {
    "--primary": "#006a62",
    "--on-primary": "#ffffff",
    "--primary-container": "#40e0d0",
    "--on-primary-container": "#006058",
    "--secondary": "#346760",
    "--on-secondary": "#ffffff",
    "--secondary-container": "#b8ede4",
    "--on-secondary-container": "#3b6d66",
    "--tertiary": "#5b598d",
    "--on-tertiary": "#ffffff",
    "--tertiary-container": "#c7c4ff",
    "--on-tertiary-container": "#514f82",
    "--error": "#ba1a1a",
    "--on-error": "#ffffff",
    "--error-container": "#ffdad6",
    "--on-error-container": "#93000a",
    "--background": "#ffffff",
    "--on-background": "#161d1c",
    "--surface": "#fcf8f8",
    "--on-surface": "#1c1b1b",
    "--surface-variant": "#e0e3e3",
    "--on-surface-variant": "#444748",
    "--outline": "#747878",
    "--outline-variant": "#c4c7c8",
    "--bg-netral": "#ffffff",
    "--inverse-netral": "#000000",
  };

  const darkDefaults: Record<string, string> = {
    "--primary": "#3adccc",
    "--on-primary": "#003632",
    "--primary-container": "#004e47",
    "--on-primary-container": "#40e0d0",
    "--secondary": "#9cd1c8",
    "--on-secondary": "#1e352f",
    "--secondary-container": "#2a4b45",
    "--on-secondary-container": "#b8ede4",
    "--tertiary": "#aba8db",
    "--on-tertiary": "#32305f",
    "--tertiary-container": "#484575",
    "--on-tertiary-container": "#c7c4ff",
    "--error": "#ffb4ab",
    "--on-error": "#690005",
    "--error-container": "#93000a",
    "--on-error-container": "#ffdad6",
    "--background": "#0f1514",
    "--on-background": "#dfe4e2",
    "--surface": "#101413",
    "--on-surface": "#c0c7c5",
    "--surface-variant": "#3f4947",
    "--on-surface-variant": "#bfc9c6",
    "--outline": "#89938f",
    "--outline-variant": "#3f4947",
    "--bg-netral": "#000000",
    "--inverse-netral": "#ffffff",
  };

  return isDark
    ? darkDefaults[name] || "#000000"
    : lightDefaults[name] || "#000000";
}

// Helper function to convert RGB values to hex
function rgbToHex(rgb: string): string {
  if (!rgb) return "#000000";

  // If it's already a hex color, return it
  if (rgb.startsWith("#")) return rgb;

  // Parse RGB values from string like "255 255 255"
  const values = rgb.split(" ").map((v) => parseInt(v.trim()));
  if (values.length !== 3) return "#000000";

  return "#" + values.map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Function to create MD3Theme from CSS variables
function createThemeFromCSS(isDark = false): MD3Theme {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: getCSSVariable("--primary", isDark),
      onPrimary: getCSSVariable("--on-primary", isDark),
      primaryContainer: getCSSVariable("--primary-container", isDark),
      onPrimaryContainer: getCSSVariable("--on-primary-container", isDark),

      secondary: getCSSVariable("--secondary", isDark),
      onSecondary: getCSSVariable("--on-secondary", isDark),
      secondaryContainer: getCSSVariable("--secondary-container", isDark),
      onSecondaryContainer: getCSSVariable("--on-secondary-container", isDark),

      tertiary: getCSSVariable("--tertiary", isDark),
      onTertiary: getCSSVariable("--on-tertiary", isDark),
      tertiaryContainer: getCSSVariable("--tertiary-container", isDark),
      onTertiaryContainer: getCSSVariable("--on-tertiary-container", isDark),

      error: getCSSVariable("--error", isDark),
      onError: getCSSVariable("--on-error", isDark),
      errorContainer: getCSSVariable("--error-container", isDark),
      onErrorContainer: getCSSVariable("--on-error-container", isDark),

      background: getCSSVariable("--background", isDark),
      onBackground: getCSSVariable("--on-background", isDark),
      surface: getCSSVariable("--surface", isDark),
      onSurface: getCSSVariable("--on-surface", isDark),
      surfaceVariant: getCSSVariable("--surface-variant", isDark),
      onSurfaceVariant: getCSSVariable("--on-surface-variant", isDark),

      outline: getCSSVariable("--outline", isDark),
      outlineVariant: getCSSVariable("--outline-variant", isDark),
    },
  };
}

// Export light and dark themes
export const lightTheme = createThemeFromCSS(false);
export const darkTheme = createThemeFromCSS(true);

// For backward compatibility
export const lightMcTheme = lightTheme;
export const lightHcTheme = lightTheme;
export const darkMcTheme = darkTheme;
export const darkHcTheme = darkTheme;
