import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const ActivityData = [
  {
    id: 1,
    userId: "ASA0ADA001",
    activity: "Running",
    date: "Today",
    icons: "directions-run",
  },
  {
    id: 2,
    userId: "ASA0ADA001",
    activity: "Cycling",
    date: "Yesterday",
    icons: "directions-bike",
  },
  {
    id: 3,
    userId: "ASA0ADA001",
    activity: "Swimming",
    date: "2 days ago",
    icons: "directions-swim",
  },
];

export default function ActivityLayoutt() {
  const Router = useRouter();
  const handlePress = () => {
    Router.push("/(screens)/activityPreview/ActivPrevScreen");
  };

  const Empety = () => {
    return (
      <View className="flex-1 justify-center items-center">
        <MaterialIcons
          name="history"
          size={64}
          color="#C4C4C4"
          style={{
            width: "100%",
            textAlign: "center",
          }}
        />
        <Text
          variant="bodyMedium"
          style={{
            fontFamily: "Plus-Jakarta-Sans-Medium",
          }}
        >
          No recent activity found.
        </Text>
      </View>
    );
  };

  const hasData = () => {
    return (
      <View className="p-4 flex flex-col justify-center items-center gap-3">
        {ActivityData.map((item) => (
          <View
            key={item.id}
            className="h-fit w-full flex flex-row justify-between items-center rounded-xl bg-white py-2.5 px-2"
          >
            <View className="flex flex-row items-center gap-4">
              <View className="aspect-square w-12 items-center justify-center">
                <MaterialIcons
                  name={item.icons as any}
                  size={24}
                  color="#006A62"
                />
              </View>

              <View>
                <Text variant="labelLarge">{item.activity}</Text>
                <Text variant="bodySmall">{item.date}</Text>
              </View>
            </View>
            <IconButton icon="chevron-right" size={24} onPress={handlePress} />
          </View>
        ))}
      </View>
    );
  };

  return ActivityData.length === 0 ? <Empety /> : hasData();
}
