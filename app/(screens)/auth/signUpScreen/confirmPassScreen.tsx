import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import { parseApiError, registerUser, requestOTP } from "@/lib/apiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function ConfirmPassScreen() {
  const registerAndRequestOTP = async (confirmPassword?: string) => {
    try {
      const existingJson = await AsyncStorage.getItem(SIGNUP_PAYLOAD_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : {};

      // validate password match
      if (existing.password !== confirmPassword) {
        const e: any = new Error("Passwords do not match");
        e.response = {
          data: { message: "Passwords do not match" },
          status: 400,
        };
        throw e;
      }

      // add dummy birthdate for testing (API requires this field)
      const payload = {
        ...existing,
        birthdate: "2000-01-01", // TODO: add birthdate picker screen
      };

      // Step 1: Register user and get token
      const registerRes = await registerUser(payload);

      // Step 2: Store token (required for OTP request)
      if (registerRes?.token) {
        await AsyncStorage.setItem("userToken", registerRes.token);
      } else {
        throw new Error("No token received from registration");
      }

      // Step 3: Request OTP (will be sent to user's email)
      await requestOTP();

      // Keep signup payload for now (will cleanup after OTP verification)
      // Note: We keep it in case OTP fails and user needs to retry

      return true;
    } catch (err: any) {
      const parsed = parseApiError(err);
      const e: any = new Error(parsed.message || "Registration failed");
      e.response = { data: { message: parsed.message }, status: parsed.status };
      throw e;
    }
  };

  return (
    <LayoutSignUp
      title="Confirm password"
      label="Confirm password"
      placeholder="Enter your password"
      path={"/(screens)/auth/signUpScreen/otpScreen"}
      onSubmit={registerAndRequestOTP}
    />
  );
}
