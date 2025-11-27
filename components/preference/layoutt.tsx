import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import { Switch } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeContext";

export default function PreferenceLayout() {
  const { isDarkMode, toggleDarkMode, paperTheme } = useTheme();

  return (
    <View className="flex-1 px-6 py-2 bg-white">
      <View className="w-full py-6 flex flex-row justify-between items-center pr-14">
        <View className="flex w-full flex-row items-center gap-2">
          <MaterialIcons
            name={isDarkMode ? "dark-mode" : "light-mode"}
            size={24}
            color={paperTheme.colors.onBackground}
          />
          <Text className="text-on-background">Dark Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
}
