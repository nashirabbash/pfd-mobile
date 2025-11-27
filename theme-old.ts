import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

// Function to get CSS variable value from global.css
function getCSSVariable(name: string, isDark = false): string {
  if (typeof document !== "undefined") {
    // Web environment - read from CSS variables
    const root = document.documentElement;
    if (isDark) {
      // Temporarily apply dark theme to read dark values
      root.setAttribute("data-theme", "dark");
      const value = getComputedStyle(root).getPropertyValue(name).trim();
      root.removeAttribute("data-theme");
      return value;
    }
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  // Native environment - return default values
  // These are fallbacks that match the CSS light theme
  const lightDefaults: Record<string, string> = {
    "--md-sys-color-primary": "#006a62",
    "--md-sys-color-on-primary": "#ffffff",
    "--md-sys-color-primary-container": "#40e0d0",
    "--md-sys-color-on-primary-container": "#006058",
    "--md-sys-color-secondary": "#346760",
    "--md-sys-color-on-secondary": "#ffffff",
    "--md-sys-color-secondary-container": "#b8ede4",
    "--md-sys-color-on-secondary-container": "#3b6d66",
    "--md-sys-color-tertiary": "#5b598d",
    "--md-sys-color-on-tertiary": "#ffffff",
    "--md-sys-color-tertiary-container": "#c7c4ff",
    "--md-sys-color-on-tertiary-container": "#514f82",
    "--md-sys-color-error": "#ba1a1a",
    "--md-sys-color-on-error": "#ffffff",
    "--md-sys-color-error-container": "#ffdad6",
    "--md-sys-color-on-error-container": "#93000a",
    "--md-sys-color-background": "#ffffff",
    "--md-sys-color-on-background": "#161d1c",
    "--md-sys-color-surface": "#fcf8f8",
    "--md-sys-color-on-surface": "#1c1b1b",
    "--md-sys-color-surface-variant": "#e0e3e3",
    "--md-sys-color-on-surface-variant": "#444748",
    "--md-sys-color-outline": "#747878",
    "--md-sys-color-outline-variant": "#c4c7c8",
    "--md-sys-color-shadow": "#000000",
    "--md-sys-color-scrim": "#000000",
    "--md-sys-color-inverse-surface": "#313030",
    "--md-sys-color-inverse-on-surface": "#f4f0ef",
    "--md-sys-color-inverse-primary": "#3adccc",
  };

  const darkDefaults: Record<string, string> = {
    "--md-sys-color-primary": "#3adccc",
    "--md-sys-color-on-primary": "#003632",
    "--md-sys-color-primary-container": "#004e47",
    "--md-sys-color-on-primary-container": "#40e0d0",
    "--md-sys-color-secondary": "#9cd1c8",
    "--md-sys-color-on-secondary": "#1e352f",
    "--md-sys-color-secondary-container": "#2a4b45",
    "--md-sys-color-on-secondary-container": "#b8ede4",
    "--md-sys-color-tertiary": "#aba8db",
    "--md-sys-color-on-tertiary": "#32305f",
    "--md-sys-color-tertiary-container": "#484575",
    "--md-sys-color-on-tertiary-container": "#c7c4ff",
    "--md-sys-color-error": "#ffb4ab",
    "--md-sys-color-on-error": "#690005",
    "--md-sys-color-error-container": "#93000a",
    "--md-sys-color-on-error-container": "#ffdad6",
    "--md-sys-color-background": "#0f1514",
    "--md-sys-color-on-background": "#dfe4e2",
    "--md-sys-color-surface": "#101413",
    "--md-sys-color-on-surface": "#c0c7c5",
    "--md-sys-color-surface-variant": "#3f4947",
    "--md-sys-color-on-surface-variant": "#bfc9c6",
    "--md-sys-color-outline": "#89938f",
    "--md-sys-color-outline-variant": "#3f4947",
    "--md-sys-color-shadow": "#000000",
    "--md-sys-color-scrim": "#000000",
    "--md-sys-color-inverse-surface": "#dfe4e2",
    "--md-sys-color-inverse-on-surface": "#2d3230",
    "--md-sys-color-inverse-primary": "#006a62",
  };

  return isDark
    ? darkDefaults[name] || "#000000"
    : lightDefaults[name] || "#000000";
}

// Function to create MD3Theme from CSS variables
function createThemeFromCSS(isDark = false): MD3Theme {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: getCSSVariable("--md-sys-color-primary", isDark),
      onPrimary: getCSSVariable("--md-sys-color-on-primary", isDark),
      primaryContainer: getCSSVariable(
        "--md-sys-color-primary-container",
        isDark
      ),
      onPrimaryContainer: getCSSVariable(
        "--md-sys-color-on-primary-container",
        isDark
      ),

      secondary: getCSSVariable("--md-sys-color-secondary", isDark),
      onSecondary: getCSSVariable("--md-sys-color-on-secondary", isDark),
      secondaryContainer: getCSSVariable(
        "--md-sys-color-secondary-container",
        isDark
      ),
      onSecondaryContainer: getCSSVariable(
        "--md-sys-color-on-secondary-container",
        isDark
      ),

      tertiary: getCSSVariable("--md-sys-color-tertiary", isDark),
      onTertiary: getCSSVariable("--md-sys-color-on-tertiary", isDark),
      tertiaryContainer: getCSSVariable(
        "--md-sys-color-tertiary-container",
        isDark
      ),
      onTertiaryContainer: getCSSVariable(
        "--md-sys-color-on-tertiary-container",
        isDark
      ),

      error: getCSSVariable("--md-sys-color-error", isDark),
      onError: getCSSVariable("--md-sys-color-on-error", isDark),
      errorContainer: getCSSVariable("--md-sys-color-error-container", isDark),
      onErrorContainer: getCSSVariable(
        "--md-sys-color-on-error-container",
        isDark
      ),

      background: getCSSVariable("--md-sys-color-background", isDark),
      onBackground: getCSSVariable("--md-sys-color-on-background", isDark),
      surface: getCSSVariable("--md-sys-color-surface", isDark),
      onSurface: getCSSVariable("--md-sys-color-on-surface", isDark),
      surfaceVariant: getCSSVariable("--md-sys-color-surface-variant", isDark),
      onSurfaceVariant: getCSSVariable(
        "--md-sys-color-on-surface-variant",
        isDark
      ),

      outline: getCSSVariable("--md-sys-color-outline", isDark),
      outlineVariant: getCSSVariable("--md-sys-color-outline-variant", isDark),
      shadow: getCSSVariable("--md-sys-color-shadow", isDark),
      scrim: getCSSVariable("--md-sys-color-scrim", isDark),

      inverseSurface: getCSSVariable("--md-sys-color-inverse-surface", isDark),
      inverseOnSurface: getCSSVariable(
        "--md-sys-color-inverse-on-surface",
        isDark
      ),
      inversePrimary: getCSSVariable("--md-sys-color-inverse-primary", isDark),
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
