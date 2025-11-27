import React, { createContext, useContext, useEffect, useState } from "react";
import {
  darkHcTheme,
  darkMcTheme,
  darkTheme,
  lightHcTheme,
  lightMcTheme,
  lightTheme,
} from "../theme";

type ThemeMode =
  | "light"
  | "light-mc"
  | "light-hc"
  | "dark"
  | "dark-mc"
  | "dark-hc";

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: typeof lightTheme;
  isDarkMode: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  // Style objects for NativeWind integration
  styles: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      error: string;
      background: string;
      surface: string;
      surfaceVariant: string;
      primaryContainer: string;
      secondaryContainer: string;
      tertiaryContainer: string;
      errorContainer: string;
    };
    text: {
      primary: string;
      onPrimary: string;
      secondary: string;
      onSecondary: string;
      tertiary: string;
      onTertiary: string;
      error: string;
      onError: string;
      background: string;
      onBackground: string;
      surface: string;
      onSurface: string;
      onSurfaceVariant: string;
      outline: string;
      onPrimaryContainer: string;
      onSecondaryContainer: string;
      onTertiaryContainer: string;
      onErrorContainer: string;
    };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");

  // Function to update CSS variables for NativeWind integration
  const updateCSSVariables = (theme: any) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", theme.colors.primary);
      root.style.setProperty("--theme-on-primary", theme.colors.onPrimary);
      root.style.setProperty(
        "--theme-primary-container",
        theme.colors.primaryContainer
      );
      root.style.setProperty(
        "--theme-on-primary-container",
        theme.colors.onPrimaryContainer
      );
      root.style.setProperty("--theme-secondary", theme.colors.secondary);
      root.style.setProperty("--theme-on-secondary", theme.colors.onSecondary);
      root.style.setProperty(
        "--theme-secondary-container",
        theme.colors.secondaryContainer
      );
      root.style.setProperty(
        "--theme-on-secondary-container",
        theme.colors.onSecondaryContainer
      );
      root.style.setProperty("--theme-tertiary", theme.colors.tertiary);
      root.style.setProperty("--theme-on-tertiary", theme.colors.onTertiary);
      root.style.setProperty(
        "--theme-tertiary-container",
        theme.colors.tertiaryContainer
      );
      root.style.setProperty(
        "--theme-on-tertiary-container",
        theme.colors.onTertiaryContainer
      );
      root.style.setProperty("--theme-error", theme.colors.error);
      root.style.setProperty("--theme-on-error", theme.colors.onError);
      root.style.setProperty(
        "--theme-error-container",
        theme.colors.errorContainer
      );
      root.style.setProperty(
        "--theme-on-error-container",
        theme.colors.onErrorContainer
      );
      root.style.setProperty("--theme-background", theme.colors.background);
      root.style.setProperty(
        "--theme-on-background",
        theme.colors.onBackground
      );
      root.style.setProperty("--theme-surface", theme.colors.surface);
      root.style.setProperty("--theme-on-surface", theme.colors.onSurface);
      root.style.setProperty(
        "--theme-surface-variant",
        theme.colors.surfaceVariant
      );
      root.style.setProperty(
        "--theme-on-surface-variant",
        theme.colors.onSurfaceVariant
      );
      root.style.setProperty("--theme-outline", theme.colors.outline);
      root.style.setProperty(
        "--theme-outline-variant",
        theme.colors.outlineVariant
      );
      root.style.setProperty("--theme-shadow", theme.colors.shadow);
      root.style.setProperty("--theme-scrim", theme.colors.scrim);
      root.style.setProperty(
        "--theme-inverse-surface",
        theme.colors.inverseSurface
      );
      root.style.setProperty(
        "--theme-inverse-on-surface",
        theme.colors.inverseOnSurface
      );
      root.style.setProperty(
        "--theme-inverse-primary",
        theme.colors.inversePrimary
      );
    }
  };

  // Function to get theme based on mode
  const getTheme = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return lightTheme;
      case "light-mc":
        return lightMcTheme;
      case "light-hc":
        return lightHcTheme;
      case "dark":
        return darkTheme;
      case "dark-mc":
        return darkMcTheme;
      case "dark-hc":
        return darkHcTheme;
      default:
        return lightTheme;
    }
  };

  const theme = getTheme(themeMode);
  const isDarkMode = themeMode.startsWith("dark");

  // Create style objects for NativeWind integration
  const styles = {
    background: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      tertiary: theme.colors.tertiary,
      error: theme.colors.error,
      background: theme.colors.background,
      surface: theme.colors.surface,
      surfaceVariant: theme.colors.surfaceVariant,
      primaryContainer: theme.colors.primaryContainer,
      secondaryContainer: theme.colors.secondaryContainer,
      tertiaryContainer: theme.colors.tertiaryContainer,
      errorContainer: theme.colors.errorContainer,
    },
    text: {
      primary: theme.colors.primary,
      onPrimary: theme.colors.onPrimary,
      secondary: theme.colors.secondary,
      onSecondary: theme.colors.onSecondary,
      tertiary: theme.colors.tertiary,
      onTertiary: theme.colors.onTertiary,
      error: theme.colors.error,
      onError: theme.colors.onError,
      background: theme.colors.background,
      onBackground: theme.colors.onBackground,
      surface: theme.colors.surface,
      onSurface: theme.colors.onSurface,
      onSurfaceVariant: theme.colors.onSurfaceVariant,
      outline: theme.colors.outline,
      onPrimaryContainer: theme.colors.onPrimaryContainer,
      onSecondaryContainer: theme.colors.onSecondaryContainer,
      onTertiaryContainer: theme.colors.onTertiaryContainer,
      onErrorContainer: theme.colors.onErrorContainer,
    },
  };

  // Update CSS variables when theme changes (for web only)
  useEffect(() => {
    updateCSSVariables(theme);
  }, [theme]);

  // Single function to handle any theme change
  const setTheme = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  // Toggle between light and dark (keeping contrast level)
  const toggleDarkMode = () => {
    if (themeMode.startsWith("dark")) {
      // Convert dark theme to light equivalent
      const lightVariant = themeMode.replace("dark", "light") as ThemeMode;
      setThemeModeState(lightVariant);
    } else {
      // Convert light theme to dark equivalent
      const darkVariant = themeMode.replace("light", "dark") as ThemeMode;
      setThemeModeState(darkVariant);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, theme, isDarkMode, setTheme, toggleDarkMode, styles }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
