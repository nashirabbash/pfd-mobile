import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

const deviceData = [
  { id: 1, name: "Device A" },
  { id: 2, name: "Device B" },
  { id: 3, name: "Device C" },
];
export default function SelectDevcLayoutt() {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  return (
    <View className="px-6 py-2 bg-white flex flex-col h-full w-full">
      <RadioButton.Group
        onValueChange={(newValue) => setSelectedDevice(newValue)}
        value={selectedDevice}
      >
        {deviceData.map((device) => {
          const value = device.id.toString();
          const selected = selectedDevice === value;
          return (
            <Pressable
              key={device.id}
              onPress={() => setSelectedDevice(value)}
              className={`self-stretch py-2 flex flex-row justify-between items-center overflow-hidden`}
            >
              <View className="flex flex-row items-center gap-2">
                <MaterialIcons name="devices-other" size={20} color="black" />
                <Text className="font-[Plus-Jakarta-Sans-Medium]">
                  {device.name}
                </Text>
              </View>
              <RadioButton
                value={value}
                status={selected ? "checked" : "unchecked"}
              />
            </Pressable>
          );
        })}
      </RadioButton.Group>
    </View>
  );
}
