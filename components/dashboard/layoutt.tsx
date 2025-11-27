import CoachNotes from "@/components/dashboard/coachNotes";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Carousel } from "../mostUseComponent/fitnessRepLayout";

export default function Layoutt() {
  const hasData = () => {
    // Replace with actual data check logic
  };

  const Empety = () => {
    return (
      <Text className="self-stretch text-center font-[Plus-Jakarta-Sans-Regular] text-base leading-6 text-black">
        No data available
      </Text>
    );
  };

  return (
    <ScrollView style={styles.screen}>
      <Text className="self-stretch text-2xl wrap-break-word font-[Plus-Jakarta-Sans-SemiBold] leading-7 text-black">
        Today
      </Text>
      <Carousel />
      <CoachNotes />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    flexDirection: "column",
    gap: 18,
    padding: 16,
    backgroundColor: "#F6F3F2",
  },
  dayTitle: {
    width: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    color: "black",
    fontSize: 24,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    lineHeight: 28,
    wordWrap: "break-word",
  },
  carrouselContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    height: "auto",
    flex: 1,
  },
});
