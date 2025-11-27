import Header from "@/components/header";
import FontProvider from "@/contexts/FontProvider";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <FontProvider>
      <Stack>
        <Stack.Screen
          name="recordScreen"
          options={{
            header: () => (
              <Header type="type4" notif={false} title="Record" icon={true} />
            ),
          }}
        />
        <Stack.Screen
          name="selectDeviceScreen"
          options={{
            header: () => (
              <Header
                type="screen"
                notif={false}
                title="Select Device"
                icon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="vitalSignScreen"
          options={{
            header: () => (
              <Header
                type="screen"
                notif={false}
                title="Vital Signs Metric"
                icon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="fitnessReport"
          options={{
            header: () => (
              <Header
                type="screen"
                notif={false}
                title="Fitness Report"
                icon={true}
              />
            ),
          }}
        />
      </Stack>
    </FontProvider>
  );
}
