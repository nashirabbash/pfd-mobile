import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseApiError, submitHealthData } from "@/lib/apiCall";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";

const AVATAR_URI_KEY = "profile_avatar_uri";

export default function HealthDataLayout() {
  const Router = useRouter();
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateYear, setDateYear] = useState("");
  const [dateMonth, setDateMonth] = useState("");
  const [dateDay, setDateDay] = useState("");
  const [gender, setGender] = useState<string>("");
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [height, setHeight] = useState<string>("");
  const [showHeightDialog, setShowHeightDialog] = useState(false);
  const [weight, setWeight] = useState<string>("");
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSave = () => {
    const year = parseInt(dateYear);
    const month = parseInt(dateMonth);
    const day = parseInt(dateDay);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setAlertMsg("Please enter valid date");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      setAlertMsg("Please enter valid year");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    if (month < 1 || month > 12) {
      setAlertMsg("Month must be between 1-12");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    if (day < 1 || day > 31) {
      setAlertMsg("Day must be between 1-31");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    const selected = new Date(year, month - 1, day);
    setBirthdate(selected);
    setShowDatePicker(false);
  };

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderDialog(false);
  };

  const handleHeightSave = () => {
    const parsed = parseInt(height);
    if (isNaN(parsed) || parsed < 50 || parsed > 300) {
      setAlertMsg("Height must be between 50-300 cm");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }
    setShowHeightDialog(false);
  };

  const handleWeightSave = () => {
    const parsed = parseInt(weight);
    if (isNaN(parsed) || parsed < 20 || parsed > 500) {
      setAlertMsg("Weight must be between 20-500 kg");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }
    setShowWeightDialog(false);
  };

  const handleContinue = async () => {
    // Validate all fields
    if (!birthdate || !gender || !height || !weight) {
      setAlertMsg("Please fill all fields");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload avatar - BYPASSED FOR DEMO
      // const avatarUri = await AsyncStorage.getItem(AVATAR_URI_KEY);
      // if (avatarUri) {
      //   try {
      //     const fileName = avatarUri.split("/").pop() || "avatar.jpg";
      //     const fileType = fileName.endsWith(".png")
      //       ? "image/png"
      //       : "image/jpeg";
      //     await uploadAvatar({
      //       uri: avatarUri,
      //       name: fileName,
      //       type: fileType,
      //     });
      //     // Clean up after upload
      //     await AsyncStorage.removeItem(AVATAR_URI_KEY);
      //   } catch (uploadErr) {
      //     console.warn("Avatar upload failed, continuing", uploadErr);
      //   }
      // }

      // 2. Submit health data
      const payload = {
        birthdate: formatDate(birthdate),
        gender: gender,
        height: parseInt(height),
        weight: parseInt(weight),
      };

      await submitHealthData(payload);

      // 3. Navigate to dashboard
      Router.push("/(screens)/hp/dashboard");
    } catch (err: any) {
      const parsed = parseApiError(err);
      setAlertMsg(parsed.message);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.primaryContainer}>
        {/* Alert for errors */}
        {alertVisible && (
          <Alert variant="destructive" style={styles.alert}>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMsg}</AlertDescription>
          </Alert>
        )}

        <View style={styles.seccondContainer}>
          <View style={styles.thirdContainer}>
            <Text style={styles.title}>Optimize Your Health Stats</Text>
            <Text style={styles.description}>
              To ensure your health data is calculated as accurately as
              possible, please provide these details. This information remains
              confidential.
            </Text>
          </View>
          <View style={styles.fourthContainer}>
            <View style={styles.inputGroup}>
              {/* Date of Birth */}
              <View style={styles.inputGrouping}>
                <Text style={styles.inputKey}>Date of Birth</Text>
                <Pressable onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.inputValues}>
                    {formatDate(birthdate)}
                  </Text>
                </Pressable>
              </View>

              {/* Sex */}
              <View style={styles.inputGrouping}>
                <Text style={styles.inputKey}>Sex</Text>
                <Pressable onPress={() => setShowGenderDialog(true)}>
                  <Text style={styles.inputValues}>
                    {gender || "Select Sex"}
                  </Text>
                </Pressable>
              </View>

              {/* Height */}
              <View style={styles.inputGrouping}>
                <Text style={styles.inputKey}>Height</Text>
                <Pressable onPress={() => setShowHeightDialog(true)}>
                  <Text style={styles.inputValues}>
                    {height ? `${height} cm` : "Select Height"}
                  </Text>
                </Pressable>
              </View>

              {/* Weight */}
              <View style={styles.inputGrouping}>
                <Text style={styles.inputKey}>Weight</Text>
                <Pressable onPress={() => setShowWeightDialog(true)}>
                  <Text style={styles.inputValues}>
                    {weight ? `${weight} kg` : "Select Weight"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleContinue}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Continue
          </Button>
        </View>

        {/* Date Picker Modal */}
        <Portal>
          <Dialog
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
          >
            <Dialog.Title>Select Date of Birth</Dialog.Title>
            <Dialog.Content>
              <View style={styles.dateInputContainer}>
                <TextInput
                  mode="outlined"
                  label="Year"
                  keyboardType="numeric"
                  placeholder="YYYY"
                  value={dateYear}
                  onChangeText={setDateYear}
                  maxLength={4}
                  style={styles.dateInput}
                />
                <TextInput
                  mode="outlined"
                  label="Month"
                  keyboardType="numeric"
                  placeholder="MM"
                  value={dateMonth}
                  onChangeText={setDateMonth}
                  maxLength={2}
                  style={styles.dateInput}
                />
                <TextInput
                  mode="outlined"
                  label="Day"
                  keyboardType="numeric"
                  placeholder="DD"
                  value={dateDay}
                  onChangeText={setDateDay}
                  maxLength={2}
                  style={styles.dateInput}
                />
              </View>
              <Text style={styles.dateHelper}>
                Enter date in format: YYYY-MM-DD
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDatePicker(false)}>Cancel</Button>
              <Button onPress={handleDateSave}>Set Date</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Gender Dialog */}
        <Portal>
          <Dialog
            visible={showGenderDialog}
            onDismiss={() => setShowGenderDialog(false)}
          >
            <Dialog.Title>Select Sex</Dialog.Title>
            <Dialog.Content>
              <Button
                mode="outlined"
                onPress={() => handleGenderSelect("Male")}
                style={styles.dialogButton}
              >
                Male
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleGenderSelect("Female")}
                style={styles.dialogButton}
              >
                Female
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleGenderSelect("Other")}
                style={styles.dialogButton}
              >
                Other
              </Button>
            </Dialog.Content>
          </Dialog>
        </Portal>

        {/* Height Dialog */}
        <Portal>
          <Dialog
            visible={showHeightDialog}
            onDismiss={() => setShowHeightDialog(false)}
          >
            <Dialog.Title>Enter Height (cm)</Dialog.Title>
            <Dialog.Content>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="e.g., 175"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowHeightDialog(false)}>Cancel</Button>
              <Button onPress={handleHeightSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Weight Dialog */}
        <Portal>
          <Dialog
            visible={showWeightDialog}
            onDismiss={() => setShowWeightDialog(false)}
          >
            <Dialog.Title>Enter Weight (kg)</Dialog.Title>
            <Dialog.Content>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g., 70"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowWeightDialog(false)}>Cancel</Button>
              <Button onPress={handleWeightSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 64,
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  seccondContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thirdContainer: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    width: 352,
    textAlign: "center",
    color: "var(--Schemes-On-Primary-Fixed, #1A1C1C)",
    fontSize: 36,
    // fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    lineHeight: 48,
    letterSpacing: 1,
    wordWrap: "break-word",
  },
  description: {
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    color: "#5D5F5F",
    fontSize: 16,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.5,
    wordWrap: "break-word",
  },
  fourthContainer: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    marginTop: 32,
  },
  inputGroup: {
    width: "100%",
    height: "auto",
    backgroundColor: "#FCF8F8",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
  },
  inputGrouping: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
  },
  inputKey: {
    textAlign: "left",
    width: "auto",
    color: "#1B1C1C",
    fontSize: 14,
    // fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    lineHeight: 48,
    wordWrap: "break-word",
  },
  inputValues: {
    textAlign: "right",
    width: "auto",
    color: "#5D5F5F",
    fontSize: 14,
    // fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    lineHeight: 48,
    wordWrap: "break-word",
  },
  buttonGroup: {
    width: "100%",
    height: "auto",
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  button: {
    width: "100%",
    height: "auto",
    borderRadius: 200,
    fontSize: 16,
    backgroundColor: "#006A62",
  },
  alert: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    zIndex: 1000,
  },
  dialogButton: {
    marginVertical: 4,
  },
  dateInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  dateInput: {
    flex: 1,
  },
  dateHelper: {
    fontSize: 12,
    color: "#5D5F5F",
    textAlign: "center",
    marginTop: 8,
  },
});
