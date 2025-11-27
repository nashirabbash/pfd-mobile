import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";

const AVATAR_URI_KEY = "profile_avatar_uri";

export default function PhotoPickLayout() {
  const [visible, setVisible] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const Router = useRouter();
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSkip = () => {
    Router.push("/(screens)/auth/profileFillScreen/personalDataScreen");
  };

  const handleNext = async () => {
    // save avatar URI to AsyncStorage and navigate
    if (capturedUri) {
      try {
        await AsyncStorage.setItem(AVATAR_URI_KEY, capturedUri);
      } catch (err) {
        console.warn("Failed to save avatar URI", err);
      }
    }
    Router.push("/(screens)/auth/profileFillScreen/personalDataScreen");
  };

  const openCamera = async () => {
    // request permission if not granted
    if (!permission?.granted) {
      await requestPermission();
    }
    // open in-app camera UI inside the dialog
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        // close camera and keep dialog open to preview
        setIsCameraOpen(false);
      }
    } catch (err) {
      // ignore capture errors for now
      console.warn("capture error", err);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.primaryContainer}>
        <View style={styles.secContainer}>
          <Image
            source={{
              uri:
                capturedUri ??
                "https://api.dicebear.com/9.x/notionists/svg?seed=Adrian",
            }}
            style={styles.images}
          />
        </View>
        <View style={styles.thirdContainer}>
          <Button
            mode="contained"
            onPress={capturedUri ? handleNext : showDialog}
            style={styles.buttonnFirst}
          >
            {capturedUri ? "Next" : "Pick Photo"}
          </Button>
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={hideDialog}
              style={styles.dialog}
            >
              <Dialog.Content style={styles.dialogContent}>
                {/* if camera is open, show in-app camera */}
                {isCameraOpen ? (
                  <View style={styles.cameraContainer}>
                    {!permission?.granted ? (
                      <Text>No access to camera</Text>
                    ) : (
                      <View style={styles.cameraWrapper}>
                        <CameraView
                          style={styles.camera}
                          facing="front"
                          ref={cameraRef}
                        />
                        {/* circular frame overlay */}
                        <View pointerEvents="none" style={styles.overlayCenter}>
                          <View style={styles.overlayCircle} />
                        </View>
                        <View style={styles.cameraButtons}>
                          <Button
                            mode="contained"
                            onPress={handleCapture}
                            style={styles.captureButton}
                          >
                            Take Photo
                          </Button>
                          <Button
                            mode="outlined"
                            onPress={closeCamera}
                            style={styles.captureButton}
                          >
                            Cancel
                          </Button>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  // preview: show either captured image or placeholder avatar
                  <>
                    <Image
                      style={styles.imagesPick}
                      source={{
                        uri:
                          capturedUri ??
                          "https://api.dicebear.com/9.x/notionists/svg?seed=Adrian",
                      }}
                    />
                    <Text style={styles.imageDesc}>Pick our Photo Profile</Text>
                    <View style={styles.buttonContainer}>
                      <Button
                        mode="contained"
                        onPress={capturedUri ? hideDialog : openCamera}
                        style={{
                          ...styles.buttonPick,
                          backgroundColor: "#006A62",
                        }}
                      >
                        {capturedUri ? "OK" : "Take Photo"}
                      </Button>
                      <Button style={styles.buttonPick} mode="outlined">
                        Choose from Library
                      </Button>
                    </View>
                  </>
                )}
              </Dialog.Content>
            </Dialog>
          </Portal>
          <Button
            mode="outlined"
            onPress={handleSkip}
            style={styles.buttonSecond}
          >
            Skip for now
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  secContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  images: {
    aspectRatio: "1/1",
    width: "100%",
    backgroundColor: "#E4E4E4",
    borderRadius: 500,
    borderColor: "#0000",
    borderWidth: 1,
  },
  buttonnFirst: {
    width: "100%",
    height: "auto",
    borderRadius: 200,
    backgroundColor: "#006A62",
    fontSize: 16,
  },
  buttonSecond: {
    width: "100%",
    height: "auto",
    borderRadius: 200,
    fontSize: 16,
  },
  thirdContainer: {
    width: "100%",
    height: "auto",
    gap: 18,
    marginBottom: 48,
  },
  dialog: {
    backgroundColor: "white",
  },
  dialogContent: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 12,
  },
  imagesPick: {
    aspectRatio: "1/1",
    width: 280,
    backgroundColor: "#E4E4E4",
    borderRadius: 500,
  },
  imageDesc: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    height: "auto",
    gap: 12,
    marginTop: 24,
  },
  buttonPick: {
    height: "auto",
    fontSize: 16,
    borderRadius: 200,
  },
  dialogTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    width: "100%",
  },
  /* camera / overlay styles */
  cameraContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 320,
    height: 320,
    borderRadius: 160,
    overflow: "hidden",
    backgroundColor: "black",
  },
  overlayCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "transparent",
  },
  cameraButtons: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  captureButton: {
    flex: 1,
  },
});
