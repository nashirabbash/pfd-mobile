import Header from "@/components/header";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Profile" type="type3" notif={false} />,
        }}
      />
    </Stack>
  );
}
