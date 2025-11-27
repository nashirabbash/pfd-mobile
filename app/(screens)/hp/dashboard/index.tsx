import Layoutt from "@/components/dashboard/layoutt";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { BackHandler } from "react-native";

export default function Dashboard() {
  const navigation: any = useNavigation();

  // Prevent navigating back from dashboard - exit app instead
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Exit app on back press
        BackHandler.exitApp();
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
          BackHandler.exitApp();
        }
      );

      return () => {
        backHandlerSub && backHandlerSub.remove && backHandlerSub.remove();
        unsubscribeBeforeRemove && unsubscribeBeforeRemove();
      };
    }, [navigation])
  );

  return <Layoutt />;
}
