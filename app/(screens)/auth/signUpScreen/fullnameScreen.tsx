import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function FullnameScreen() {
  const saveNameAndProceed = async (name?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};
      const merged = { ...existing, name };
      await AsyncStorage.setItem(SIGNUP_PAYLOAD_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
    return true;
  };

  return (
    <LayoutSignUp
      title="What is your name?"
      label="Full name"
      placeholder="Enter your fullname"
      path={"/(screens)/auth/signUpScreen/emailScreen"}
      onSubmit={saveNameAndProceed}
    />
  );
}
