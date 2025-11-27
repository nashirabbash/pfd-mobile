import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function UsernameScreen() {
  const saveUsernameAndProceed = async (username?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};
      const merged = { ...existing, username };
      await AsyncStorage.setItem(SIGNUP_PAYLOAD_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
    return true;
  };

  return (
    <LayoutSignUp
      title="Create username"
      label="Username"
      placeholder="Enter your username"
      path={"/(screens)/auth/signUpScreen/roleScreen"}
      onSubmit={saveUsernameAndProceed}
    />
  );
}
