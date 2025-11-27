import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import React from "react";
import { Text, View } from "react-native";

const notifData = [
  {
    id: 1,
    type: "message",
    title: "New Message",
    body: "You have received a new message.",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "System Alert",
    body: "Your system requires an update.",
    read: true,
  },
];

const ICONS: Record<string, ComponentProps<typeof MaterialIcons>["name"]> = {
  message: "message",
  alert: "notification-important",
};

export default function Notiflayout() {
  if (notifData.length === 0) {
    return (
      <View>
        <Text>No notifications available.</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col items-center px-6 py-2 bg-white gap-3 h-full">
      {notifData.map((notif) => (
        <View
          key={notif.id}
          className="flex self-stretch flex-row justify-start items-center bg-white p-3 rounded-lg gap-4 elevation-xs"
        >
          <MaterialIcons
            name={ICONS[notif.type] ?? "notifications"}
            size={20}
            color={notif.read ? "#9CA3AF" : "#111827"}
          />
          <View className="flex flex-col justify-start">
            <Text className="font-[Plus-Jakarta-Sans-Medium]">
              {notif.title}
            </Text>
            <Text className="font-[Plus-Jakarta-Sans-Regular] text-sm text-gray-800">
              {notif.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
