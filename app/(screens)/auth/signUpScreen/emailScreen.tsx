import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function EmailScreen() {
  const saveEmailAndProceed = async (email?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};
      const merged = { ...existing, email };
      await AsyncStorage.setItem(SIGNUP_PAYLOAD_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
    return true;
  };

  return (
    <LayoutSignUp
      title="Enter your email"
      label="Email"
      placeholder="Enter your email"
      path={"/(screens)/auth/signUpScreen/usernameScreen"}
      onSubmit={saveEmailAndProceed}
    />
  );
}
