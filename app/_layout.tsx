import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import FontProvider from "../contexts/FontProvider";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "./global.css";

export const unstable_settings = {
  anchor: "(screens)",
};

function AppContent() {
  const { paperTheme } = useTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    // FontProvider ensures fonts are loaded before rendering the rest of the app
    <FontProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </FontProvider>
  );
}
