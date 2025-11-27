import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import * as Device from "expo-device";
import React from "react";
import { View } from "react-native";

export default function ForgotPass() {
  const isPHONE = Device.deviceType === Device.DeviceType.PHONE;
  const ForgotPassScreen = () => {
    return (
      <LayoutSignUp
        title="Forgot password"
        label="Email"
        placeholder="Enter your email"
        showTextBelow={false}
      />
    );
  };

  return isPHONE ? (
    <ForgotPassScreen />
  ) : (
    <View className="flex flex-col items-center justify-center w-full h-full bg-white">
      <ForgotPassScreen />
    </View>
  );
}
