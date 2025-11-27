import React, { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../theme";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  paperTheme: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to update DOM class for NativeWind dark mode
  const updateDOMTheme = (dark: boolean) => {
    if (typeof document !== "undefined") {
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateDOMTheme(newDarkMode);
  };

  // Initialize theme on mount
  useEffect(() => {
    updateDOMTheme(isDarkMode);
  }, [isDarkMode]);

  const paperTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        paperTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
