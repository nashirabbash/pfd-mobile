import { Stack } from "expo-router";
import React from "react";
import { PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
  const paperTheme = useTheme();
  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </PaperProvider>
  );
}
