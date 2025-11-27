import Header from "@/components/header";
import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeContext";

export default function EditProfilelayout() {
  const { paperTheme } = useTheme();
  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen
          name="hpSize"
          options={{
            header: () => (
              <Header
                type="screen"
                notif={false}
                title="Edit Profile"
                icon={true}
              />
            ),
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
