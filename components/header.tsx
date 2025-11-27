import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

interface HeaderProps {
  type: "default" | "screen" | "type3" | "type4";
  notif: boolean;
  icon?: boolean;
  title?: string;
}

export default function Header(props: HeaderProps) {
  const Router = useRouter();

  const handlePress = () => {
    Router.push("/notif/notifScreen");
  };
  const handleClickBack = () => {
    Router.back();
  };

  const handleClickBackDashboard = () => {
    Router.replace("/hp/dashboard");
  };

  const headerType = () => {
    switch (props.type) {
      case "default":
        return (
          <View className="self-stretch flex flex-row justify-between items-center px-6 pb-2 pt-10 bg-white h-fit sticky">
            <Text className="text-[#1D1B20] text-[40px] font-[Nico-Moji] leading-[28px]">
              PFD
            </Text>
            {props.notif ? (
              <Pressable
                className="size-10 rounded-[20px] items-center justify-center flex"
                onPress={handlePress}
              >
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="black"
                />
              </Pressable>
            ) : null}
          </View>
        );
      case "screen":
        return (
          <View className="flex flex-row items-center gap-1 px-6 pb-2 pt-12 bg-white h-fit sticky">
            {props.icon ? (
              <Pressable onPress={handleClickBack}>
                <MaterialIcons name="arrow-back-ios" size={20} color="black" />
              </Pressable>
            ) : null}
            <Text className="self-stretch justify-center text-xl font-[Plus-Jakarta-Sans-SemiBold] leading-7 line-clamp-1">
              {props.title}
            </Text>
          </View>
        );
      case "type3":
        return (
          <View className="flex items-center pb-[18px] px-6 bg-white fixed pt-12">
            <Text className="w-full text-left text-3xl font-[Plus-Jakarta-Sans-SemiBold]">
              {props.title}
            </Text>
          </View>
        );
      case "type4":
        return (
          <View className="flex flex-row items-center gap-1 px-6 pb-2 pt-12 bg-white h-fit sticky">
            {props.icon ? (
              <IconButton
                onPress={handleClickBackDashboard}
                icon="close"
                style={{
                  position: "absolute",
                  left: 5,
                  borderRadius: 0,
                  bottom: -5,
                }}
              />
            ) : null}
            <Text className="w-full items-center text-center text-xl font-[Plus-Jakarta-Sans-SemiBold]">
              {props.title}
            </Text>
          </View>
        );
    }
  };

  return headerType();
}
