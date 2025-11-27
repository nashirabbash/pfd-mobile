import { getProfile, logout, parseApiError } from "@/lib/apiCall";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function Layoutt() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (err: any) {
      const error = parseApiError(err);
      setAlertMsg(error.message);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const item = [
    {
      title: "Device Management",
      icon: "devices-other",
      path: "/deviceManagement/hpSize",
      textColor: "text-black",
      color: "#000",
    },
    {
      title: "Preference",
      icon: "palette",
      path: "/preference/hpSize",
      textColor: "text-black",
      color: "#000",
    },
    {
      title: "Logout",
      icon: "logout",
      path: "/profile/logout",
      textColor: "text-red-600",
      color: "#FF0000",
    },
  ];

  const Router = useRouter();
  const handlePress = async (path: Href) => {
    // Intercept logout path and perform client-side logout
    if (String(path) === "/profile/logout") {
      try {
        // remove token via helper
        await logout();
        // remove other local keys used during onboarding
        await AsyncStorage.multiRemove([
          "signup_payload",
          "profile_avatar_uri",
          "userToken",
        ]).catch(() => {});
        // replace navigation stack with login screen
        Router.replace("/(screens)/auth/login");
      } catch (err: any) {
        const e = parseApiError(err);
        setAlertMsg(e.message);
        setAlertVisible(true);
      }
      return;
    }

    Router.push(path);
  };

  if (loading) {
    return (
      <View className="w-full h-full bg-white flex items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="w-full h-full bg-white px-6 py-3 flex flex-col">
      {alertVisible && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{alertMsg}</AlertDescription>
        </Alert>
      )}

      <View className="self-stretch py-4 border-b border-gray-200 flex flex-row justify-between items-center overflow-hidden">
        <View className="flex flex-row items-center gap-3">
          <Image
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#E4E4E4",
              borderRadius: 32,
            }}
            source={{
              uri:
                profile?.avatarUrl ||
                "https://api.dicebear.com/9.x/notionists/svg?seed=" +
                  (profile?.username || "User"),
            }}
          />
          <View className="p-2.5 flex flex-col gap-2">
            <Text className="text-left text-Schemes-On-Background text-base font-[Plus-Jakarta-Sans-Medium] leading-4 tracking-wide">
              {profile?.fullName || profile?.name || "User"}
            </Text>
            <Text className="text-left text-Schemes-On-Background text-base font-[Plus-Jakarta-Sans-Regular] leading-4 tracking-wide">
              Edit Profile
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => handlePress("/(screens)/editProfile/hpSize" as any)}
          className="flex items-center justify-center size-12"
        >
          <MaterialIcons name="arrow-forward-ios" size={18} color="#000" />
        </Pressable>
      </View>

      <View>
        <Text className="py-3 text-left justify-start text-black text-xl font-[Plus-Jakarta-Sans-SemiBold]">
          Settings
        </Text>
        {item.map((it) => (
          <Pressable
            key={it.title}
            className="self-stretch py-4 flex flex-row gap-2 items-center overflow-hidden"
            onPress={() => handlePress(it.path as any)}
          >
            <MaterialIcons name={it.icon as any} size={24} color={it.color} />
            <Text className={`font-[Plus-Jakarta-Sans-Medium] ${it.textColor}`}>
              {it.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
