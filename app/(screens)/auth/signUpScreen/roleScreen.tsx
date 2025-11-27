import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function RoleScreen() {
  const saveRoleAndProceed = async (role?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};
      const merged = { ...existing, role };
      await AsyncStorage.setItem(SIGNUP_PAYLOAD_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
    return true;
  };

  return (
    <LayoutSignUp
      title="Choose your role"
      input={2}
      path={"/(screens)/auth/signUpScreen/passwordScreen"}
      onSubmit={saveRoleAndProceed}
    />
  );
}
