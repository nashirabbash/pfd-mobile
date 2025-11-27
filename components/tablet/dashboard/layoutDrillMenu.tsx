import useMenuVisibility from "@/hooks/useMenuVisibility";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  PaperProvider,
  useTheme,
} from "react-native-paper";
import EditDialog from "../dialogEditAdd";
import { drillData } from "./dataMock";

// Types for grid items
type DrillItem = {
  id: string;
  title: string;
  member: { id: string; avatar?: string }[];
  focus: string;
};

type SpacerItem = { id: string; spacer: boolean };
const numCol = 3;
const lenthData = drillData.length;
const remainder = lenthData % numCol;
const emptyItems = remainder === 0 ? 0 : numCol - remainder;

const spacing = 16;
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - spacing * (numCol + 1)) / numCol;

const spacers = Array(emptyItems)
  .fill(null)
  .map((_, index) => ({
    id: `spacer-${index}`,
    spacer: true,
  }));

const completeData = [...drillData, ...spacers];

export default function LayoutDrillMenu() {
  const {
    visible: dialogVisible,
    open: showDialog,
    close: closeDialog,
  } = useMenuVisibility();
  const paperTheme = useTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <View className="flex flex-col items-center justify-start p-6 h-screen bg-white w-full gap-3">
        <View className="w-full items-center h-fit justify-start flex flex-row">
          <Button
            icon={() => (
              <MaterialIcons
                name="add"
                size={24}
                color={paperTheme.colors.onSecondary}
              />
            )}
            mode="contained"
            buttonColor={paperTheme.colors.secondary}
          >
            Add Drill
          </Button>
        </View>
        <GridDrill showDialog={showDialog} />
        <EditDialog
          visible={dialogVisible}
          onDismiss={closeDialog}
          title="Edit Drill"
        />
      </View>
    </PaperProvider>
  );
}

function GridDrill({ showDialog }: { showDialog: () => void }) {
  const renderItem = ({
    item,
    index,
  }: {
    item: DrillItem | SpacerItem;
    index: number;
  }) => {
    // Type guard for spacer items
    if ("spacer" in item && item.spacer) {
      return <View style={styles.spacers} />;
    }
    const drill = item as DrillItem;

    return (
      <View style={styles.screenContainer}>
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-[Plus-Jakarta-Sans-SemiBold]">
            {drill.title}
          </Text>
          <MenuButton />
        </View>
        <View className="flex flex-row items-center justify-start h-fit relative">
          {drill.member
            .slice(0, 4)
            .map((member: { id: string; avatar?: string }, idx: number) => (
              <View
                key={member.id}
                style={{
                  marginLeft: idx > 0 ? -8 : 0,
                  zIndex: drill.member.length - idx,
                }}
              >
                <Avatar.Image
                  size={32}
                  source={{
                    uri:
                      member.avatar ||
                      "https://randomuser.me/api/portraits/men/1.jpg",
                  }}
                  style={{
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
              </View>
            ))}
          {drill.member.length > 4 && (
            <View
              style={{
                marginLeft: -8,
                zIndex: 0,
              }}
            >
              <Avatar.Text
                size={32}
                label={`+${drill.member.length - 4}`}
                style={{
                  borderWidth: 2,
                  borderColor: "white",
                  backgroundColor: "#6b7280",
                }}
              />
            </View>
          )}
        </View>
        <Text className="flex-1 text-sm" numberOfLines={2}>
          {drill.focus}
        </Text>
        <View className="w-full flex flex-row items-center justify-end gap-2.5">
          <Button
            icon="pencil"
            mode="text"
            onPress={showDialog}
            labelStyle={{ fontSize: 12 }}
            style={styles.button}
          >
            Edit
          </Button>
          <Button
            icon="play"
            mode="contained"
            onPress={() => {}}
            compact
            labelStyle={{ fontSize: 12 }}
            style={styles.button}
          >
            Start
          </Button>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="w-full h-screen flex-1">
      <FlatList
        data={completeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numCol}
      />
    </SafeAreaView>
  );
}

function MenuButton({ onEdit }: { onEdit?: () => void }) {
  const { visible, open, close } = useMenuVisibility();
  const Router = useRouter();

  const handleViewDetails = () => {
    Router.push("/(screens)/tablet/(header)/drillDetailScreen");
  };
  return (
    <Menu
      visible={visible}
      onDismiss={close}
      anchor={
        <IconButton
          icon={() => (
            <MaterialIcons name="more-vert" size={16} color="black" />
          )}
          size={16}
          onPress={open}
        />
      }
      theme={{ colors: { primary: "white" } }}
    >
      <Menu.Item
        onPress={() => {
          close();
          handleViewDetails();
        }}
        title="View Details"
        leadingIcon={"eye"}
      />
    </Menu>
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
