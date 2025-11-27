import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import React from "react";
import { BackHandler, Platform, StyleSheet, Text, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import ButtonnAuth from "../buttonn";

interface LoginLayoutProps {
  PHONE?: boolean;
  // onSubmit expected from screen: (emailOrUsername: string, password: string) => Promise<any>
  onSubmit?: (emailOrUsername: string, password: string) => Promise<any>;
  loading?: boolean;
}

export default function LoginLayout({ ...props }: LoginLayoutProps) {
  const isPHONE = props.PHONE;
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  // submission state intentionally omitted to avoid changing styles; parent can show errors
  const navigation = useNavigation(); // for back handler listener
  const router = useRouter(); // for programmatic navigation
  const paperTheme = useTheme();

  // prevent navigating back from this screen — on Android hardware back we exit the app
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") return;

      const onBackPress = () => {
        BackHandler.exitApp();
        return true; // handled
      };

      const backHandlerSub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      const unsubscribeBeforeRemove = navigation.addListener(
        "beforeRemove",
        (e: any) => {
          // prevent any navigation back action (header back, gesture)
          e.preventDefault();
          BackHandler.exitApp();
        }
      );

      return () => {
        backHandlerSub && backHandlerSub.remove && backHandlerSub.remove();
        unsubscribeBeforeRemove && unsubscribeBeforeRemove();
      };
    }, [navigation])
  );

  return (
    <View
      style={[
        styles.primaryContainer,
        { backgroundColor: paperTheme.colors.background },
      ]}
    >
      {/* logo & input */}
      <View style={styles.secondContainer}>
        <Text style={styles.title}>PFD</Text>
        <View style={styles.thirdContainer}>
          {alertVisible ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {alertMsg}
                {/* dismiss text */}
                <Text
                  onPress={() => setAlertVisible(false)}
                  style={{ marginTop: 8, fontWeight: "700" }}
                >
                  Dismiss
                </Text>
              </AlertDescription>
            </Alert>
          ) : null}
          <TextInput
            mode="outlined"
            label="Email"
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
          />
          <Link href="/(screens)/auth/forgotPass" asChild>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Link>
        </View>
      </View>

      {/* button login, jika user role bukan owner team, arahkan ke hp/dashboard, jika owner team, arahkan ke tablet/(header)/dashboard */}
      <ButtonnAuth
        title="Login"
        pathFirst={
          isPHONE
            ? "/(screens)/hp/dashboard"
            : "/(screens)/tablet/(header)/dashboard"
        }
        textBelow="Don't have an account?"
        titleBelow="Sign Up"
        pathSec={"/(screens)/auth/signUpScreen/fullnameScreen"}
        showTextBelow={true}
        // onPress={async () => {
        //   // if parent provided onSubmit, call it with current inputs; parent handles login result
        //   if (props.onSubmit) {
        //     try {
        //       await props.onSubmit(identifier, password);
        //       // navigate to dashboard after successful login
        //       const path = isPHONE
        //         ? "/(screens)/hp/dashboard"
        //         : "/(screens)/tablet/(header)/dashboard";
        //       router.push(path);
        //     } catch (err: any) {
        //       const parsed = parseApiError(err);
        //       setAlertMsg(parsed.message);
        //       setAlertVisible(true);
        //       // after 300 ms, hide alert
        //       setTimeout(() => {
        //         setAlertVisible(false);
        //       }, 300);
        //       return;
        //     }
        //   }
        // }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  secondContainer: {
    width: "100%",
    height: "auto",
    gap: 40,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  thirdContainer: {
    width: "100%",
    height: "auto",
    gap: 20,
  },
  input: {
    fontFamily: "Plus-Jakarta-Sans-Regular",
  },
  title: {
    fontFamily: "Nico-Moji",
    fontSize: 84,
    color: "black",
  },
  forgotPasswordText: {
    fontSize: 12,
    fontFamily: "Plus-Jakarta-Sans-Medium",
  },
});
