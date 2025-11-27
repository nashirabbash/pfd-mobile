import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";

export default function Header() {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(!isPressed);
  };

  return (
    <View className="pt-2 bg-white">
      <View className="relative w-full items-center justify-center px-6 py-2.5 h-fit">
        <Text className="w-full items-center text-center text-[64px] font-[Nico-Moji]">
          PFD
        </Text>
        <View className="flex flex-row absolute justify-between items-center w-full">
          {isPressed ? (
            <View className="flex flex-row items-center justify-center gap-2">
              <Button
                icon={() => (
                  <MaterialIcons name="stop" size={20} color="white" />
                )}
                mode="contained"
                style={{
                  borderRadius: 12,
                }}
                onPress={handlePress}
              >
                Stop Live Session
              </Button>
              <Text className="h-full px-3.5 items-center justify-center bg-gray-300 py-3 rounded-xl text-black font-[Plus-Jakarta-Sans-SemiBold] text-sm">
                00:15:23
              </Text>
            </View>
          ) : (
            <Button
              icon={() => (
                <MaterialIcons name="play-arrow" size={20} color="white" />
              )}
              mode="contained"
              style={{
                borderRadius: 12,
              }}
              onPress={handlePress}
            >
              Start Live Session
            </Button>
          )}
          <View className="flex flex-row items-center gap-2">
            <IconButton icon="bell-outline" />
            <Pressable className="size-12 aspect-square items-center justify-center rounded-full">
              <Avatar.Image
                source={{ uri: "https://example.com/avatar.jpg" }}
                size={40}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonFont: {
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
});
