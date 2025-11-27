import Header from "@/components/header";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ActivPrevScreen"
        options={{
          header: () => (
            <Header
              type="screen"
              notif={false}
              title="Activity Preview"
              icon={true}
            />
          ),
        }}
      />
    </Stack>
  );
}
