import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Href, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  useTheme,
} from "react-native-paper";
import LiveMapslayoutt from "../liveMaps/liveMapslayoutt";

type TrackPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
};

// Haversine formula to calculate distance between two points
const haversineDistance = (point1: TrackPoint, point2: TrackPoint): number => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(point2.latitude - point1.latitude);
  const dLng = toRad(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) *
      Math.cos(toRad(point2.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

// Format duration to HH:MM:SS or MM:SS
const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
};

// Format pace as min:sec per km
const formatPace = (seconds: number, meters: number): string => {
  if (meters <= 0) return "0:00";
  const secPerKm = (seconds / meters) * 1000;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function Layoutt() {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [distance, setDistance] = useState(0); // in meters
  const [duration, setDuration] = useState(0); // in seconds
  const [currentSpeed, setCurrentSpeed] = useState(0); // in m/s

  const startTime = useRef<number | null>(null);
  const pausedTime = useRef<number>(0);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const paperTheme = useTheme();
  const Router = useRouter();

  const [visible, setVisible] = useState(true);
  const showDialogStop = () => {
    setVisible(true);
  };
  const hideDialogStop = () => {
    setVisible(false);
    handleStart();
    Router.replace("/(screens)/activityPreview/ActivPrevScreen");
  };

  // Timer effect
  useEffect(() => {
    if (isStarted && !isPaused) {
      if (!startTime.current) {
        startTime.current = Date.now() - pausedTime.current * 1000;
      }

      timerInterval.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - (startTime.current || 0)) / 1000
        );
        setDuration(elapsed);
      }, 1000);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (isPaused && startTime.current) {
        pausedTime.current = duration;
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isStarted, isPaused, duration]);

  // Handle location updates from map
  const handleLocationUpdate = useCallback((point: TrackPoint) => {
    setTrackPoints((prev) => {
      const updated = [...prev, point];

      // Calculate distance
      if (prev.length > 0) {
        const lastPoint = prev[prev.length - 1];
        const dist = haversineDistance(lastPoint, point);

        // Filter out unrealistic jumps (e.g., > 100m in 3s = 120 km/h)
        if (dist < 100) {
          setDistance((prevDist) => prevDist + dist);
        }
      }

      // Set current speed (prefer GPS speed if available)
      if (point.speed !== undefined && point.speed !== null) {
        setCurrentSpeed(point.speed);
      } else if (prev.length > 0) {
        const lastPoint = prev[prev.length - 1];
        const dist = haversineDistance(lastPoint, point);
        const timeDiff = (point.timestamp - lastPoint.timestamp) / 1000; // seconds
        if (timeDiff > 0) {
          setCurrentSpeed(dist / timeDiff);
        }
      }

      return updated;
    });
  }, []);

  const handleStart = () => {
    if (!isStarted) {
      // Starting new session
      setIsStarted(true);
      setTrackPoints([]);
      setDistance(0);
      setDuration(0);
      setCurrentSpeed(0);
      startTime.current = Date.now();
      pausedTime.current = 0;
    } else {
      // Stopping session
      setIsStarted(false);
      setIsPaused(false);
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      startTime.current = null;
      pausedTime.current = 0;
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClick = (path: Href) => {
    Router.push(path);
  };

  // Calculate metrics
  const distanceKm = (distance / 1000).toFixed(2);
  const speedKmh = (currentSpeed * 3.6).toFixed(1);
  const avgPace = formatPace(duration, distance);
  const durationFormatted = formatDuration(duration);

  const styles = StyleSheet.create({
    buttonUtama: {
      aspectRatio: "1/1",
      width: 80,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: paperTheme.colors.primary,
      position: "relative",
    },
    buttonSec: {
      aspectRatio: "1/1",
      width: 80,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: paperTheme.colors.outline,
      position: "relative",
    },
    buttonText: {
      position: "absolute",
      color: paperTheme.colors?.onPrimary ?? "#ffffff",
      fontFamily: "Plus-Jakarta-Sans-SemiBold",
    },
    buttonTextSec: {
      position: "absolute",
      color: paperTheme.colors?.onSecondary ?? "#ffffff",
      fontFamily: "Plus-Jakarta-Sans-SemiBold",
    },
  });

  return (
    <PaperProvider>
      <View className="self-stretch flex flex-col w-full h-screen justify-start items-center">
        <LiveMapslayoutt
          isTracking={isStarted && !isPaused}
          onLocationUpdate={handleLocationUpdate}
        />
        {isStarted ? (
          <View className="flex flex-col w-full">
            <View className="bg-white flex flex-row justify-between items-center px-6 py-2.5">
              <Text className="text-sm font-[Plus-Jakarta-Sans-Medium]">
                See Vital Sign Metric
              </Text>
              <Pressable
                className="items-center justify-center aspect-square flex  flex-col h-8"
                onPress={() => handleClick("/(screens)/record/vitalSignScreen")}
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={16}
                  color="black"
                  style={{
                    transform: [{ rotate: "90deg" }],
                    position: "absolute",
                    bottom: 4,
                  }}
                />
              </Pressable>
            </View>

            {/* Maps Metric/GPS metric */}
            <View className="flex flex-row bg-white w-full px-4 justify-between border-t-[0.5] border-gray-300">
              <View className="flex-1 h-16 pt-2.5 flex-col justify-center items-center">
                <Text className="font-[Plus-Jakarta-Sans-SemiBold] text-xl">
                  {durationFormatted}
                </Text>
                <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                  Duration
                </Text>
              </View>
              <View className="flex-1 h-16 pt-2.5 flex-col justify-center items-center">
                <Text className="font-[Plus-Jakarta-Sans-SemiBold] text-xl">
                  {speedKmh}{" "}
                  <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                    km/h
                  </Text>
                </Text>
                <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                  Speed
                </Text>
              </View>
              <View className="flex-1 h-16 pt-2.5 flex-col justify-center items-center">
                <Text className="font-[Plus-Jakarta-Sans-SemiBold] text-xl">
                  {avgPace}{" "}
                  <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                    /km
                  </Text>
                </Text>
                <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                  Avg Pace
                </Text>
              </View>
              <View className="flex-1 h-16 pt-2.5 flex-col justify-center items-center">
                <Text className="font-[Plus-Jakarta-Sans-SemiBold] text-xl">
                  {distanceKm}{" "}
                  <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                    km
                  </Text>
                </Text>
                <Text className="font-[Plus-Jakarta-Sans-Medium] text-sm tracking-tight">
                  Distance
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex flex-row bg-white w-full px-4 justify-between">
            <Pressable
              className="self-stretch  h-16 pt-2.5 flex-1 flex-col justify-start items-center gap-1"
              onPress={() =>
                handleClick("/(screens)/record/selectDeviceScreen")
              }
            >
              <MaterialIcons name="devices-other" size={24} color="black" />
            </Pressable>
            <Pressable className="self-stretch h-16 pt-2.5 flex-1 flex-col justify-start items-center gap-1">
              <MaterialIcons name="music-note" size={24} color="black" />
            </Pressable>
          </View>
        )}
        <View className="bg-white w-full h-fit pb-20 pt-4 justify-center items-center">
          {isStarted ? (
            <View className="flex flex-row items-center justify-center gap-6">
              {isPaused ? (
                <>
                  <Pressable style={styles.buttonSec} onPress={handlePause}>
                    <Text style={styles.buttonTextSec}>RESUME</Text>
                  </Pressable>
                  <Pressable
                    style={styles.buttonUtama}
                    onPress={showDialogStop}
                  >
                    <Text style={styles.buttonText}>STOP</Text>
                  </Pressable>
                  <Portal>
                    <Dialog visible={visible} onDismiss={hideDialogStop}>
                      <Dialog.Title>Stop Recording</Dialog.Title>
                      <Dialog.Content>
                        <Text>Are you sure you want to stop?</Text>
                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button
                          mode="text"
                          style={{
                            minWidth: 80,
                            borderRadius: 200,
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          mode="contained"
                          style={{
                            minWidth: 80,
                            borderRadius: 200,
                          }}
                          onPress={hideDialogStop}
                        >
                          Stop
                        </Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                </>
              ) : (
                <Pressable style={styles.buttonUtama} onPress={handlePause}>
                  <Text style={styles.buttonText}>PAUSE</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable style={styles.buttonUtama} onPress={handleStart}>
              <Text style={styles.buttonText}>START</Text>
            </Pressable>
          )}
        </View>
      </View>
    </PaperProvider>
  );
}
