import LayoutSignUp from "@/components/auth/signUpScreen/layout";
import { parseApiError, verifyOTP } from "@/lib/apiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const SIGNUP_PAYLOAD_KEY = "signup_payload";

export default function OtpScreen() {
  const verifyOtpAndProceed = async (code?: string) => {
    try {
      // Verify OTP with backend
      await verifyOTP(code || "");

      // OTP verified successfully
      // Cleanup temporary signup storage
      await AsyncStorage.removeItem(SIGNUP_PAYLOAD_KEY);

      return true;
    } catch (err: any) {
      const parsed = parseApiError(err);
      const e: any = new Error(parsed.message || "OTP verification failed");
      e.response = { data: { message: parsed.message }, status: parsed.status };
      throw e;
    }
  };

  return (
    <LayoutSignUp
      title="Enter code"
      description="To verify your account, enter 6-digit code we've sent to your email"
      input={1}
      path={"/(screens)/auth/profileFillScreen/photoPick"}
      onSubmit={verifyOtpAndProceed}
    />
  );
}
