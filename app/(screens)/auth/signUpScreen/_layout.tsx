import * as Device from "expo-device";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function SignUpLayout() {
  const isPHONE = Device.deviceType === Device.DeviceType.PHONE;
  const DefLayout = () => {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="fullnameScreen" />
        <Stack.Screen name="emailScreen" />
        <Stack.Screen name="passwordScreen" />
        <Stack.Screen name="confirmPassScreen" />
        <Stack.Screen name="usernameScreen" />
        <Stack.Screen name="otpScreen" />
        <Stack.Screen name="roleScreen" />
      </Stack>
    );
  };

  return isPHONE ? (
    <DefLayout />
  ) : (
    <View className="flex flex-col items-center justify-center w-full h-full bg-white">
      <DefLayout />
    </View>
  );
}
