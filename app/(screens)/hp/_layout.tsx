import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeContext";

export default function Hplayout() {
  const { paperTheme } = useTheme();
  const navMenu = [
    {
      name: "dashboard",
      title: "Home",
      icon: "dashboard",
      //   return: dashboard,
    },
    {
      name: "maps",
      title: "Maps",
      icon: "map",
      // return: maps,
    },
    {
      name: "record",
      title: "Record",
      icon: "radio-button-checked",
      // return: record,
    },
    {
      name: "activity",
      title: "Activity",
      icon: "equalizer",
      // return: activity,
    },
    {
      name: "profile",
      title: "Profile",
      icon: "person",
      // return: profile,
    },
  ];
  return (
    <PaperProvider theme={paperTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#006A62", // teal for active
          tabBarInactiveTintColor: "#6b7280", // gray for inactive
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Plus-Jakarta-Sans-Medium",
          },
          tabBarStyle: {
            minHeight: 80,
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 8, // android shadow
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: -4 },
            paddingHorizontal: 12,
            shadowRadius: 8,
            gap: 0,
          },
          tabBarItemStyle: {
            paddingTop: 5,
            paddingBottom: 20,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        {navMenu.map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.title,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name={item.icon as any}
                  size={size ?? 24}
                  color={color ?? "black"}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </PaperProvider>
  );
}
