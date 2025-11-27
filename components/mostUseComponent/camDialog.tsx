import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog } from "react-native-paper";

interface camDialogProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function CamDialog({ isVisible, onDismiss }: camDialogProps) {
  const handleClose = () => {
    onDismiss();
  };

  const handleTakePhoto = () => {
    // Implement take photo functionality here
  };

  const handleChooseFromGallery = () => {
    // Implement choose from gallery functionality here
  };

  return (
    <Dialog
      visible={isVisible}
      style={{ backgroundColor: "white" }}
      onDismiss={handleClose}
    >
      <Dialog.Content>
        <View className="flex flex-row justify-end self-stretch">
          <Button mode="text" onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </Button>
        </View>
        <View style={styles.DialogContent}>
          <Image
            source={{
              uri: "https://api.dicebear.com/9.x/notionists/svg?seed=Adrian",
            }}
            style={{
              width: 240,
              height: 240,
              borderRadius: 120,
              backgroundColor: "#E4E4E4",
            }}
          />
          <Dialog.Actions style={styles.DialogActions}>
            <Button
              mode="contained"
              style={styles.buttonTakePhoto}
              onPress={() => {}}
            >
              Take Photo
            </Button>
            <Button
              mode="outlined"
              style={styles.buttonChooseFromGallery}
              onPress={() => {}}
            >
              Choose from Gallery
            </Button>
          </Dialog.Actions>
        </View>
      </Dialog.Content>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  DialogContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    width: "100%",
  },
  DialogActions: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "column",
    gap: 12,
  },
  buttonTakePhoto: {
    alignSelf: "stretch",
    width: "100%",
  },
  buttonChooseFromGallery: {
    alignSelf: "stretch",
    width: "100%",
  },
});
