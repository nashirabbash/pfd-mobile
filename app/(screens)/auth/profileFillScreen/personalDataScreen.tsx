import HealthDataLayout from "@/components/auth/profileFill/HealthDataLayout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { BackHandler } from "react-native";

export default function PersonalDataScreen() {
  const navigation: any = useNavigation();

  // Prevent navigating back from this screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // return true to indicate we've handled the back action and prevent default
        return true;
      };

      const backHandlerSub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      const unsubscribeBeforeRemove = navigation.addListener(
        "beforeRemove",
        (e: any) => {
          // prevent any navigation back action (header back, gesture)
          e.preventDefault();
        }
      );

      return () => {
        backHandlerSub && backHandlerSub.remove && backHandlerSub.remove();
        unsubscribeBeforeRemove && unsubscribeBeforeRemove();
      };
    }, [navigation])
  );

  return <HealthDataLayout />;
}
