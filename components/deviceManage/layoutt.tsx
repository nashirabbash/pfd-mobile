import {
  addDevice,
  getDeviceLogs,
  getDevices,
  parseApiError,
  removeDevice,
} from "@/lib/apiCall";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  Button,
  Dialog,
  FAB,
  Menu,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";

export default function Layoutt() {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }: any) => setState({ open });

  const { open } = state;
  // track which device's menu is open (device name), null when none
  const [visibleMenu, setVisibleMenu] = React.useState<string | null>(null);
  const openMenu = (name: string) => setVisibleMenu(name);
  const closeMenu = () => setVisibleMenu(null);

  // dialog input code manual
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // dialog remove device
  const [visibleRemove, setVisibleRemove] = React.useState(false);
  const showRemoveDialog = () => setVisibleRemove(true);
  const hideRemoveDialog = () => setVisibleRemove(false);

  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // Form states for adding device
  const [serialCode, setSerialCode] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const MenuItem = [
    {
      title: "View Details",
      icons: "visibility",
      onPress: (device: any) => {
        // Navigate to device details or show details dialog
        console.log("View Details", device);
      },
    },
    {
      title: "Download Log",
      icons: "download",
      onPress: async (device: any) => {
        try {
          setLoading(true);
          const logs = await getDeviceLogs(device.uuid || device.id);
          console.log("Device logs:", logs);
          // TODO: Implement actual download logic
          setAlertMsg("Logs downloaded successfully");
          setAlertVisible(true);
        } catch (err: any) {
          const e = parseApiError(err);
          setAlertMsg(e.message);
          setAlertVisible(true);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      title: "Remove Device",
      icons: "delete",
      onPress: (device: any) => {
        setSelectedDevice(device);
        showRemoveDialog();
      },
    },
  ];

  const DialogInput = () => {
    return (
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title>Input Device Manually</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={"Input Serial Code"}
              mode="outlined"
              value={serialCode}
              onChangeText={setSerialCode}
              disabled={submitting}
              style={{
                fontFamily: "Plus-Jakarta-Sans-Regular",
                backgroundColor: "transparent",
              }}
            />
            <TextInput
              label={"Input Name Device (Optional)"}
              mode="outlined"
              value={deviceName}
              onChangeText={setDeviceName}
              disabled={submitting}
              style={{
                fontFamily: "Plus-Jakarta-Sans-Regular",
                backgroundColor: "transparent",
                marginTop: 8,
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              mode="text"
              disabled={submitting}
              style={{
                minWidth: 80,
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddDevice}
              mode="contained"
              loading={submitting}
              disabled={submitting}
              style={{
                minWidth: 80,
              }}
            >
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const DialogRemove = () => {
    return (
      <Portal>
        <Dialog
          visible={visibleRemove}
          onDismiss={hideRemoveDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title>Remove Device</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to remove{" "}
              {selectedDevice?.name || "this device"}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideRemoveDialog}
              mode="text"
              disabled={submitting}
              style={{
                minWidth: 80,
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleRemoveDevice}
              mode="contained"
              loading={submitting}
              disabled={submitting}
              style={{
                minWidth: 80,
              }}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "green";
      case "warning":
        return "yellow";
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await getDevices();
      if (res && res.success && Array.isArray(res.data)) {
        setDevices(res.data);
      } else if (res && Array.isArray(res)) {
        // some handlers return array directly
        setDevices(res);
      } else {
        setDevices([]);
      }
    } catch (err: any) {
      const e = parseApiError(err);
      setAlertMsg(e.message);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!serialCode.trim()) {
      setAlertMsg("Serial code is required");
      setAlertVisible(true);
      return;
    }

    try {
      setSubmitting(true);
      const res = await addDevice({
        serialCode: serialCode.trim(),
        name: deviceName.trim() || undefined,
      });

      if (res && res.success) {
        setAlertMsg("Device added successfully");
        setAlertVisible(true);
        setSerialCode("");
        setDeviceName("");
        hideDialog();
        fetchDevices(); // Refresh device list
      }
    } catch (err: any) {
      const e = parseApiError(err);
      setAlertMsg(e.message);
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDevice = async () => {
    if (!selectedDevice) return;

    try {
      setSubmitting(true);
      const deviceId = selectedDevice.uuid || selectedDevice.id;
      const res = await removeDevice(deviceId);

      if (res && res.success) {
        setAlertMsg("Device removed successfully");
        setAlertVisible(true);
        hideRemoveDialog();
        setSelectedDevice(null);
        fetchDevices(); // Refresh device list
      }
    } catch (err: any) {
      const e = parseApiError(err);
      setAlertMsg(e.message);
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PaperProvider>
      <View className="h-full w-full relative">
        <DialogRemove />
        <DialogInput />

        {/* Alert Dialog */}
        <Portal>
          <Dialog
            visible={alertVisible}
            onDismiss={() => setAlertVisible(false)}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Title>
              {alertMsg.includes("success") ? "Success" : "Notice"}
            </Dialog.Title>
            <Dialog.Content>
              <Text>{alertMsg}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setAlertVisible(false)}
                mode="contained"
                style={{ minWidth: 80 }}
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View className="px-6 py-2 bg-white flex flex-col h-full w-full">
          {loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : alertVisible ? (
            <View className="py-8">
              <Text className="text-red-600">{alertMsg}</Text>
            </View>
          ) : devices.length === 0 ? (
            <View className="py-8">
              <Text className="text-gray-500">No devices found.</Text>
            </View>
          ) : (
            devices.map((device) => (
              <View
                key={device.uuid || device.id || device.name}
                className="self-stretch py-3 flex flex-row justify-between items-center overflow-hidden"
              >
                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons
                    name="devices-other"
                    size={20}
                    color={getStatusColor(device.status || device.state || "")}
                  />
                  <Text className="font-[Plus-Jakarta-Sans-Medium]">
                    {device.name ||
                      device.label ||
                      device.deviceName ||
                      "Unnamed Device"}
                  </Text>
                </View>
                <Menu
                  visible={
                    visibleMenu === (device.name || device.uuid || device.id)
                  }
                  onDismiss={closeMenu}
                  anchor={
                    <Pressable
                      onPress={() =>
                        openMenu(device.name || device.uuid || device.id)
                      }
                      className="size-10 items-center justify-center"
                    >
                      <MaterialIcons name="more-vert" size={20} />
                    </Pressable>
                  }
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  {MenuItem.map((menu) => (
                    <Pressable
                      key={menu.title}
                      onPress={() => {
                        closeMenu();
                        menu.onPress?.(device);
                      }}
                      className="flex-row items-center px-3 py-2"
                    >
                      <MaterialIcons name={menu.icons as any} size={16} />
                      <Text className="ml-3">{menu.title}</Text>
                    </Pressable>
                  ))}
                </Menu>
              </View>
            ))
          )}
        </View>

        <Portal>
          <FAB.Group
            open={open}
            visible={true}
            icon={open ? "close" : "plus"}
            actions={[
              {
                icon: () => <MaterialIcons name="qr-code-scanner" size={24} />,
                label: "Scan QR code",
                onPress: () => console.log("Scan QR code"),
              },
              {
                icon: () => <MaterialIcons name="keyboard" size={24} />,
                label: "Input Manually",
                onPress: showDialog,
              },
            ]}
            onStateChange={onStateChange}
            style={{ position: "absolute", bottom: 64, right: 16 }}
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}
