import Header from "@/components/header";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="notifScreen"
        options={{
          header: () => (
            <Header
              type="screen"
              notif={false}
              title="Notifications"
              icon={true}
            />
          ),
        }}
      />
    </Stack>
  );
}
