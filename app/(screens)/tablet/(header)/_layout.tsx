import Header from "@/components/tablet/header";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
  // lock orientation to landscape
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    lockOrientation();

    // cleanup: unlock on unmount
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const paperTheme = useTheme();
  return (
    <PaperProvider theme={paperTheme}>
      <Stack
        screenOptions={{
          header: () => <Header />,
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="drillDetailScreen" />
      </Stack>
    </PaperProvider>
  );
}
