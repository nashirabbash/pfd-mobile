import { getProfile, parseApiError, updateUserProfile } from "@/lib/apiCall";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import {
  Button,
  PaperProvider,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { useTheme } from "../../contexts/ThemeContext";
import CamDialog from "../mostUseComponent/camDialog";

export default function Layout() {
  const router = useRouter();
  const [isCameraDialogVisible, setIsCameraDialogVisible] = useState(false);
  const { paperTheme } = useTheme();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const handleSaveChanges = () => {
    saveProfile();
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      // Build payload and omit empty values
      const payload: any = {};
      if (fullName) payload.name = fullName;
      if (username) payload.username = username;
      if (email) payload.email = email;
      if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
      if (sex) payload.sex = sex;
      if (height) payload.height = Number(height);
      if (weight) payload.weight = Number(weight);

      const res = await updateUserProfile(payload);
      // show success
      setSnackbarMsg(res && res.message ? res.message : "Profile updated");
      setSnackbarVisible(true);
      // navigate back to profile main screen
      router.replace("/(screens)/hp/profile");
    } catch (err: any) {
      const e = parseApiError(err);
      setSnackbarMsg(e.message || "Failed to save profile");
      setSnackbarVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const openCameraDialog = () => setIsCameraDialogVisible(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        if (res && res.success && res.data) {
          const p = res.data;
          setFullName(p.fullName || p.name || "");
          setUsername(p.username || "");
          setEmail(p.email || "");
          setDateOfBirth(p.dateOfBirth || p.birthdate || "");
          setSex(p.sex || p.gender || "");
          setHeight(p.height ? String(p.height) : "");
          setWeight(p.weight ? String(p.weight) : "");
        }
      } catch (err: any) {
        const e = parseApiError(err);
        setSnackbarMsg(e.message || "Failed to load profile");
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <View className="w-full h-full flex flex-col bg-white">
        {loading && (
          <View className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
        <View className="px-6 w-full flex-col gap-5 pb-6">
          <View className="flex flex-row items-center justify-center self-stretch pb-3">
            <Pressable
              onPress={openCameraDialog}
              className="relative aspect-square size-24 items-center"
            >
              <Image
                source={{
                  uri: "https://api.dicebear.com/9.x/notionists/svg?seed=Adrian",
                }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "#E4E4E4",
                }}
              />
              <View className="items-center justify-center size-fit absolute right-[-5] -bottom-6 bg-white rounded-full p-2 elevation-sm">
                <MaterialIcons className="" name="camera-alt" size={20} />
              </View>
            </Pressable>
            <Portal>
              <CamDialog
                isVisible={isCameraDialogVisible}
                onDismiss={() => setIsCameraDialogVisible(false)}
              />
            </Portal>
          </View>
          <View className="flex flex-col gap-4 w-full elevation-0 z-0">
            <View className="flex flex-row justify-between items-center w-full gap-3">
              <TextInput
                mode="outlined"
                label="Full Name"
                style={[styles.input, styles.halfInput]}
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                mode="outlined"
                label="Username"
                style={[styles.input, styles.halfInput]}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <TextInput
              mode="outlined"
              label="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View className="py-3 bg-[#F6F3F2] px-6 w-full h-fit">
          <Text variant="labelLarge">Atlet Information</Text>
          <Text variant="bodySmall">
            uses for calculation BMI, BMR and other
          </Text>
        </View>
        <View className="px-6 py-6 gap-4 flex flex-col">
          <TextInput
            mode="outlined"
            label="Date of Birth"
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
          />
          <TextInput
            mode="outlined"
            label="Sex"
            style={styles.input}
            value={sex}
            onChangeText={setSex}
          />
          <TextInput
            mode="outlined"
            label="Height (cm)"
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            label="Weight (kg)"
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
        <View className="pb-16 pt-16 px-6">
          <Button
            className=""
            mode="contained"
            onPress={handleSaveChanges}
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </View>
      </View>
      <SnackbarWrapper
        visible={snackbarVisible}
        message={snackbarMsg}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </PaperProvider>
  );
}

// Snackbar at bottom-level
function SnackbarWrapper({ visible, message, onDismiss }: any) {
  return (
    <Portal>
      <Snackbar visible={visible} onDismiss={onDismiss} duration={3000}>
        {message}
      </Snackbar>
    </Portal>
  );
}

const styles = StyleSheet.create({
  input: {
    height: "auto",
    // width left unset so inputs can share row space via flex
    // use styles.halfInput to make two-column layout
    fontFamily: "Plus-Jakarta-Sans-Regular",
    shadowColor: "transparent",
    fontSize: 14,
  },
  halfInput: {
    flex: 1,
  },
});
