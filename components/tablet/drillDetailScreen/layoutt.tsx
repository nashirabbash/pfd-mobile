import useMenuVisibility from "@/hooks/useMenuVisibility";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Avatar, Button, useTheme } from "react-native-paper";
import EditDialog from "../dialogEditAdd";

interface LayouttProps {
  clicked?: boolean;
  setClicked?: (clicked: boolean) => void;
}

const numColTeam = 2;
const spacing = 16;
const widthItemTeam =
  (Dimensions.get("window").width - spacing * (numColTeam + 1)) / numColTeam;

export default function Layoutt() {
  const {
    visible: dialogVisible,
    open: showDialog,
    close: closeDialog,
  } = useMenuVisibility();
  const paperTheme = useTheme();
  const [isStarted, setIsStarted] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  return (
    <SafeAreaView className="bg-white px-6 py-4 h-screen w-full gap-4">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row items-center gap-2">
          <Button style={styles.button} mode="outlined">
            Drill 1
          </Button>
          {!isStarted ? (
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleStart}
              icon={"play"}
            >
              Start Drill
            </Button>
          ) : (
            <Button
              mode="contained"
              style={[
                styles.button,
                { backgroundColor: paperTheme.colors.error },
              ]}
              icon={"stop"}
              onPress={() => setIsStarted(false)}
            >
              Stop Drill
            </Button>
          )}
        </View>
        {!isStarted ? (
          <Button
            mode="text"
            icon={"pencil"}
            style={[styles.button]}
            onPress={showDialog}
          >
            Edit
          </Button>
        ) : null}
      </View>
      <AvaList clicked={clicked} setClicked={setClicked} />
      {!clicked ? teamFitur() : personalFitur()}
      <EditDialog
        visible={dialogVisible}
        onDismiss={closeDialog}
        title="Edit Drill"
      />
    </SafeAreaView>
  );
}

function AvaList(props: LayouttProps) {
  const { clicked, setClicked } = props;
  const handleClick = () => {
    setClicked?.(!clicked);
  };
  return (
    <View className="flex flex-row items-center justify-start">
      <Pressable
        className={`flex flex-col w-30 p-2 items-center justify-center gap-1
        ${clicked ? "bg-gray-200 rounded-lg" : ""}
        `}
        onPress={handleClick}
      >
        <Avatar.Image
          size={44}
          source={{ uri: "https://example.com/avatar1.png" }}
        />
        <Text className="text-sm font-[Plus-Jakarta-Sans-Regular] w-full text-center">
          Player Name
        </Text>
      </Pressable>
    </View>
  );
}

const temFitur = [
  {
    id: 1,
    title: "Heart Rate",
    icon: "heart",
  },
  {
    id: 2,
    title: "Speed",
    icon: "speedometer",
  },
  {
    id: 3,
    title: "Avg Pace",
    icon: "pace",
  },
  {
    id: 4,
    title: "Distance",
    icon: "ruler",
  },
];

const personalData: { id: number; title: string; icon: string }[] = [];

const renderItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.container}>
      <View className="w-full items-center flex flex-row justify-between">
        <View className="flex flex-row items-center gap-1">
          <MaterialIcons name={item.icon} size={16} />
          <Text>{item.title}</Text>
        </View>
        <Pressable className="size-fit rounded-full">
          <MaterialIcons name="info-outline" size={16} />
        </Pressable>
      </View>
      <BarChart
        width={widthItemTeam - 80}
        height={140}
        hideRules
        maxValue={200}
        stepValue={40}
      />
    </View>
  );
};

function teamFitur() {
  return (
    <SafeAreaView className="flex-1 h-screen w-full flex">
      <FlatList
        data={temFitur}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColTeam}
      />
    </SafeAreaView>
  );
}

function personalFitur() {
  return (
    <View>
      <FlatList
        data={personalData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 80,
  },
  container: {
    margin: spacing / 2,
    backgroundColor: "#FAFAFB",
    width: widthItemTeam,
    gap: 10,
    padding: 12,
    paddingRight: 24,
    borderRadius: 12,
  },
});
