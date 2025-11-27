import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AppSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function prepare() {
      try {
        // Keep the splash screen visible while we perform tasks
        await SplashScreen.preventAutoHideAsync();
      } catch {
        // ignore if already prevented/hidden
      }

      // Simulate a short loading time (replace with asset loading if needed)
      await new Promise((r) => setTimeout(r, 1000));

      if (mounted) {
        // Navigate to login (replace so splash is not in history)
        router.replace("/(screens)/auth/login");
      }

      try {
        // Hide the splash screen after navigation
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    }

    prepare();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <View className="flex items-center flex-col justify-center bg-white w-full h-full">
      <Text style={styles.fontBrand}>PFD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fontBrand: {
    fontFamily: "Nico-Moji",
    fontSize: 84,
    marginTop: 12,
  },
});
