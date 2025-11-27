import React from "react";
import { Text, View } from "react-native";
import { Avatar } from "react-native-paper";

export default function CoachNotes() {
  return (
    <View className="w-full h-fit p-4 bg-white rounded-xl">
      <View className="flex flex-row items-center gap-2">
        <Avatar.Image
          source={{ uri: "https://example.com/avatar.jpg" }}
          size={36}
        />
        <View className="flex flex-col justify-start items-start">
          <Text className="justify-center text-black text-sm font-[Plus-Jakarta-Sans-SemiBold]">
            Southgate
          </Text>
          <Text className="text-gray-800 text-xs font-[Plus-Jakarta-Sans-Medium]">
            Coach
          </Text>
        </View>
      </View>
      <Text className="px-3 py-3.5 border rounded-lg border-gray-300 min-h-36 text-sm font-[Plus-Jakarta-Sans-Regular] text-black mt-4 w-full bg-gray-200">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora quos
        iste eos!
      </Text>
    </View>
  );
}
