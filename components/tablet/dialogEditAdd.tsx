import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Dialog, Portal, TextInput } from "react-native-paper";

interface DrillItem {
  id?: string;
  spacer?: boolean;
  title: string;
  member?: { id: string; avatar?: string }[];
  focus?: string;
  visible: boolean;
  onDismiss: () => void;
}

const numCol = 3;

const spacing = 16;
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - spacing * (numCol + 1)) / numCol;

export default function EditDialog(props: DrillItem) {
  return (
    <Portal>
      <Dialog
        visible={props.visible}
        onDismiss={props.onDismiss}
        style={styles.dialog}
      >
        <Dialog.Title style={{ fontFamily: "Plus-Jakarta-Sans-Medium" }}>
          {props.title}
        </Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
          <View className="flex flex-col items-center justify-center gap-1">
            <View className="flex flex-row w-full items-center justify-between">
              <Text>Add Player</Text>
              <Button icon={"plus"}>Add</Button>
            </View>
            <View className="flex flex-row items-center justify-start w-full -ml-2">
              <Avatar.Image
                size={64}
                source={{
                  uri: "https://randomuser.me/api/portraits",
                }}
              />
              <Avatar.Image
                size={64}
                source={{
                  uri: "https://randomuser.me/api/portraits",
                }}
              />
              <Avatar.Image
                size={64}
                source={{
                  uri: "https://randomuser.me/api/portraits",
                }}
              />
              <Avatar.Image
                size={64}
                source={{
                  uri: "https://randomuser.me/api/portraits",
                }}
              />
            </View>
          </View>
          <TextInput
            mode="outlined"
            style={{
              fontFamily: "Plus-Jakarta-Sans-Regular",
              height: 200,
            }}
          >
            Input Focus Here
          </TextInput>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.onDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={props.onDismiss}
            style={styles.button}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: itemWidth,
    padding: 12,
    margin: spacing / 2,
    borderRadius: 12,
    backgroundColor: "#FAFAFB",
    height: 200,
    gap: 4,
  },
  spacers: {
    flex: 1,
    width: itemWidth,
    height: 0,
    margin: spacing / 2,
    backgroundColor: "transparent",
  },
  dialog: {
    backgroundColor: "white",
    width: 560,
    alignSelf: "center",
  },
  button: {
    minWidth: 80,
  },
});
