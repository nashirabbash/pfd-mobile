import { Href, Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface ButtonnAuthProps {
  pathFirst?: Href;
  title: string;
  textBelow?: string;
  titleBelow?: string;
  pathSec?: Href;
  showTextBelow?: boolean;
  onPress?: () => Promise<void> | void;
}

export default function ButtonnAuth(props: ButtonnAuthProps) {
  const Router = useRouter();
  const paperTheme = useTheme();
  const handleClickFirst = async () => {
    // if (props.onPress) {
    //   try {
    //     await props.onPress();
    //   } catch {
    //     // parent handles errors/logging
    //   }
    //   return;
    // }
    Router.push(props.pathFirst || "/");
  };

  return (
    <View style={styles.firstContainer}>
      <Button
        onPress={handleClickFirst}
        style={[styles.buttonn, { backgroundColor: paperTheme.colors.primary }]}
        mode="contained"
      >
        <Text
          style={[styles.buttonText, { color: paperTheme.colors.onPrimary }]}
        >
          {props.title}
        </Text>
      </Button>
      {props.showTextBelow ? (
        <Text className="font-[Plus-Jakarta-Sans-Regular]">
          {props.textBelow}{" "}
          <Link href={props.pathSec || "/"} asChild>
            <Text style={styles.linkText}>{props.titleBelow}</Text>
          </Link>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  firstContainer: {
    width: "100%",
    height: "auto",
    gap: 18,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonn: {
    width: "100%",
    height: "auto",
    borderRadius: 200,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
  linkText: {
    fontWeight: "700",
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
});
