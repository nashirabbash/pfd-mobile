import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function PassScreen() {
  const savePasswordAndProceed = async (password?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};
      const merged = { ...existing, password };
      await AsyncStorage.setItem(SIGNUP_PAYLOAD_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
    return true;
  };

  return (
    <LayoutSignUp
      title="Create password"
      label="Password"
      placeholder="Enter your password"
      path={"/(screens)/auth/signUpScreen/confirmPassScreen"}
      onSubmit={savePasswordAndProceed}
    />
  );
}
