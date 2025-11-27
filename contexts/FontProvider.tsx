import { useFonts } from "expo-font";
import React, { ReactNode } from "react";

interface FontProviderProps {
  children: ReactNode;
}

/**
 * FontProvider
 * Loads app fonts once (using expo-font) and renders children after fonts are ready.
 * Use this near your app root so all screens can use font family class names
 * such as `font-PlusJakartaSansSemiBold` safely.
 */
export default function FontProvider({ children }: FontProviderProps) {
  const [fontsLoaded] = useFonts({
    "Nico-Moji": require("../assets/fonts/NicoMoji-Regular.ttf"),
    "Plus-Jakarta-Sans-SemiBold": require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold.ttf"),
    "Plus-Jakarta-Sans-Regular": require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Regular.ttf"),
    "Plus-Jakarta-Sans-Medium": require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Medium.ttf"),
    "Plus-Jakarta-Sans-Bold": require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Bold.ttf"),
    "Plus-Jakarta-Sans-ExtraBold": require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf"),
  });

  // Avoid rendering app until fonts are loaded so Tailwind/nativewind
  // className font-... mappings work immediately.
  if (!fontsLoaded) return null;

  return <>{children}</>;
}
