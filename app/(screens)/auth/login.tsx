import LoginLayout from "@/components/auth/loginScreen/layoutt";
import { loginUser } from "@/lib/apiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const [loading, setLoading] = useState(false);
  // Handle login logic to/from api here
  const handleLogin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      const data = await loginUser(email, password);
      if (data?.token) {
        await AsyncStorage.setItem("userToken", data.token);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const isPHONE = Device.deviceType === Device.DeviceType.PHONE;
  const LoginScreen = () => {
    return (
      <View style={styles.ScreenPhone}>
        <LoginLayout PHONE={isPHONE} onSubmit={handleLogin} loading={loading} />
      </View>
    );
  };

  return isPHONE ? (
    <LoginScreen />
  ) : (
    <View style={styles.ScreenTablet}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
