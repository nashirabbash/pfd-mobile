import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { parseApiError, requestOTP } from "@/lib/apiCall";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Device from "expo-device";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import ButtonnAuth from "../buttonn";

interface LayoutSignUpProps {
  title: string;
  description?: string;
  label?: string;
  input?: number;
  placeholder?: string;
  path?: Href;
  showTextBelow?: boolean;
  onSubmit?: (value?: any) => Promise<any>;
}

export default function LayoutSignUp(props: LayoutSignUpProps) {
  const Router = useRouter();
  const handleClickBack = () => {
    Router.back();
  };
  const isPHONE = Device.deviceType === Device.DeviceType.PHONE;
  const counter = useRef(30);
  const [count, setCount] = useState<number>(counter.current);
  const [accountType, setAccountType] = useState<"Team" | "Personal">("Team");
  const [inputValue, setInputValue] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [otpValue, setOtpValue] = useState<string>("");
  const [otpInvalid, setOtpInvalid] = useState<boolean>(false);

  // decrement timer every second until 0
  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  const alertDesc = () => {
    return (
      <Alert>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>OTP has been resent successfully.</AlertDescription>
      </Alert>
    );
  };

  const handleResend = async () => {
    try {
      // Request new OTP from backend
      await requestOTP();

      // Reset UI state
      setCount(30);
      setOtpValue("");
      setOtpInvalid(false);

      return alertDesc();
    } catch (error) {
      // Show error if OTP request fails
      const parsed = parseApiError(error);
      setAlertMsg(parsed.message || "Failed to resend OTP");
      setAlertVisible(true);
    }
  };

  const inputType = () => {
    switch (props.input) {
      case 1:
        return (
          <View style={styles.sixthContainer}>
            <InputOTP
              maxLength={6}
              style={styles.otpGroup}
              value={otpValue}
              onValueChange={(v) => setOtpValue(v)}
              onComplete={async (v) => {
                if (props.onSubmit) {
                  try {
                    await props.onSubmit(v);
                    // OTP verified successfully by backend
                  } catch {
                    setOtpInvalid(true);
                    // after 5 sec set invalid to false
                    setTimeout(() => setOtpInvalid(false), 5000);
                  }
                }
              }}
              invalid={otpInvalid}
            >
              <InputOTPSlot index={0} style={styles.otpSlot} />
              <InputOTPSlot index={1} style={styles.otpSlot} />
              <InputOTPSlot index={2} style={styles.otpSlot} />
              <InputOTPSlot index={3} style={styles.otpSlot} />
              <InputOTPSlot index={4} style={styles.otpSlot} />
              <InputOTPSlot index={5} style={styles.otpSlot} />
            </InputOTP>
            {count === 0 ? (
              <Pressable
                onPress={async () => {
                  await handleResend();
                }}
                style={({ pressed }) => [
                  styles.resendCodeButton,
                  pressed && styles.resendPressed,
                ]}
              >
                <Text style={styles.resendCodeText}>Resend Code</Text>
              </Pressable>
            ) : (
              // disabled button resend code
              <Text style={[styles.resendCodeText, styles.resendDisabled]}>
                Resend Code ({count})
              </Text>
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.radioContainer}>
            <Pressable
              style={styles.radioOption}
              onPress={() => setAccountType("Team")}
            >
              <View style={styles.radioOuter}>
                {accountType === "Team" && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>Team</Text>
            </Pressable>

            <Pressable
              style={styles.radioOption}
              onPress={() => setAccountType("Personal")}
            >
              <View style={styles.radioOuter}>
                {accountType === "Personal" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Personal</Text>
            </Pressable>
          </View>
        );
      default:
        return (
          <View style={styles.fourthContainer}>
            <Text style={styles.labell}>{props.label}</Text>
            <TextInput
              mode="outlined"
              style={styles.inputt}
              label={props.placeholder}
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>
        );
    }
  };

  const layout = () => {
    return (
      <View style={styles.primaryContainer}>
        {/* button back dan input */}
        <View style={styles.secondaryContainer}>
          <Button
            mode="text"
            onPress={handleClickBack}
            style={styles.buttonBack}
          >
            <MaterialIcons name="arrow-back-ios" size={32} color="black" />
          </Button>
          <View style={styles.thirdContainer}>
            <Text style={styles.titlee}>{props.title}</Text>
            <Text style={styles.description}>{props.description}</Text>
            {alertVisible ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {alertMsg}
                  <Text
                    onPress={() => setAlertVisible(false)}
                    style={{ marginTop: 8, fontWeight: "700" }}
                  >
                    Dismiss
                  </Text>
                </AlertDescription>
              </Alert>
            ) : null}
            {inputType()}
          </View>
        </View>
        {(() => {
          const handleNext = props.onSubmit
            ? async () => {
                // prepare value based on input type
                let payload: any = undefined;
                if (!props.input) payload = inputValue; // default text input
                else if (props.input === 2) payload = accountType; // role selection

                try {
                  await props.onSubmit!(payload);
                  // navigate to provided path on success
                  if (props.path) Router.push(props.path);
                } catch (err: any) {
                  const parsed = parseApiError(err);
                  setAlertMsg(parsed.message);
                  setAlertVisible(true);
                  return;
                }
              }
            : undefined;

          return (
            <ButtonnAuth
              pathFirst={props.path}
              title="Next"
              textBelow="Already have account?"
              titleBelow="Log In"
              pathSec={"/(screens)/auth/login"}
              showTextBelow={props.showTextBelow !== undefined ? false : true}
              onPress={handleNext}
            />
          );
        })()}
      </View>
    );
  };

  return isPHONE ? (
    <View style={styles.ScreenPhone}>{layout()}</View>
  ) : (
    <View style={styles.ScreenTablet}>{layout()}</View>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    height: "100%",
    paddingBottom: 64,
  },
  secondaryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 64,
    height: "auto",
    marginTop: 104,
  },
  buttonBack: {
    alignSelf: "flex-start",
    height: "auto",
    width: "auto",
    paddingLeft: 0,
    borderRadius: 8,
  },
  thirdContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
  },
  titlee: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 33.6,
    wordWrap: "break-word",
    fontFamily: "Plus-Jakarta-Sans-Bold",
  },
  fourthContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 32,
  },
  labell: {
    width: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    color: "black",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19.6,
    wordWrap: "break-word",
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
  inputt: {
    width: "100%",
    fontFamily: "Plus-Jakarta-Sans-Regular",
  },
  ScreenTablet: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  ScreenPhone: {
    width: "100%",
    height: "100%",
    maxWidth: 450,
    maxHeight: 956,
    backgroundColor: "white",
  },
  description: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    color: "black",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 19.6,
    letterSpacing: 1,
    wordWrap: "break-word",
    marginTop: 12,
    fontFamily: "Plus-Jakarta-Sans-Regular",
  },
  otpGroup: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  otpSlot: {
    shadowColor: "transparent",
    width: 44,
    height: 44,
    borderRadius: 8,
    marginTop: 32,
  },
  resendCodeText: {
    marginTop: 24,
    fontSize: 14,
    width: "100%",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "Plus-Jakarta-Sans-Medium",
  },
  resendCodeButton: {
    marginTop: 0,
    fontFamily: "Plus-Jakarta-Sans-Medium",
  },
  resendPressed: {
    opacity: 0.8,
  },
  resendDisabled: {
    color: "#9ca3af",
  },
  radioContainer: {
    width: "100%",
    marginTop: 32,
    flexDirection: "column",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 16,
    borderColor: "#747878",
    borderWidth: 1,
    borderRadius: 8,
    fontFamily: "Plus-Jakarta-Sans-Regular",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#006A62",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#006A62",
  },
  radioLabel: {
    fontSize: 16,
    color: "black",
  },
  sixthContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});
