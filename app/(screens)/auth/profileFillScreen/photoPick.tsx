import PhotoPickLayout from "@/components/auth/profileFill/photoPickLayout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { BackHandler } from "react-native";

export default function PhotoPickScreen() {
  const navigation: any = useNavigation();

  // Prevent navigating back from this screen. When user presses hardware back or
  // tries to navigate back via header/gesture, we'll block it (do nothing).
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
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

  return <PhotoPickLayout />;
}
