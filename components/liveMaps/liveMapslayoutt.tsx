import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { LucideLayers } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type TrackPoint = Coordinate & {
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
};

type LiveMapProps = {
  isTracking: boolean;
  onLocationUpdate?: (point: TrackPoint) => void;
};

// Compute bearing in degrees from point A to B (0 = north)
function computeBearing(a: Coordinate, b: Coordinate): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (toDeg(brng) + 360) % 360; // degrees
}

export default function LiveMapslayoutt({
  isTracking,
  onLocationUpdate,
}: LiveMapProps) {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">(
    "satellite"
  );
  const [showMapMenu, setShowMapMenu] = useState(false);
  const [heatmapOption, setHeatmapOption] = useState<
    "global" | "weekly" | "night" | "private"
  >("global");
  const [showLocationLayer, setShowLocationLayer] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current; // 0 = open, positive => dragged down
  const sheetHeightRef = useRef(360);

  // Pan responder for dragging sheet (only from handle area)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only allow drag from handle area (top 50px of sheet)
        const { locationY } = evt.nativeEvent;
        return locationY < 50;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { locationY } = evt.nativeEvent;
        // Allow drag if starting from handle area or if already dragging
        return locationY < 50 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const dy = Math.max(0, gestureState.dy);
        translateY.setValue(dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dy = gestureState.dy;
        const velocity = gestureState.vy;
        const threshold = sheetHeightRef.current * 0.3;

        // Consider velocity for smoother experience
        const shouldClose = dy > threshold || (velocity > 0.5 && dy > 50);

        if (shouldClose) {
          // close with velocity-based duration
          const duration = Math.min(
            300,
            Math.max(150, 300 - Math.abs(velocity) * 100)
          );
          Animated.timing(translateY, {
            toValue: sheetHeightRef.current,
            duration: duration,
            useNativeDriver: true,
          }).start(() => {
            // hide modal
            setModalVisible(false);
            setShowMapMenu(false);
            translateY.setValue(0);
          });
        } else {
          // restore with smooth spring animation
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleCloseSheet = useCallback(() => {
    const h = sheetHeightRef.current || 300;
    Animated.spring(translateY, {
      toValue: h,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setShowMapMenu(false);
      translateY.setValue(0);
    });
  }, [translateY]);

  // Request location permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === "granted");

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const initial = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(initial);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.warn("Location permission error:", err);
        setLoading(false);
      }
    })();
  }, []);

  const startTracking = useCallback(async () => {
    try {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // 3 seconds
          distanceInterval: 5, // 5 meters
        },
        (location) => {
          const newPoint: TrackPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            accuracy: location.coords.accuracy ?? undefined,
            speed: location.coords.speed ?? undefined,
          };

          // Filter out low accuracy points
          if (newPoint.accuracy && newPoint.accuracy > 50) {
            return;
          }

          setTrackPoints((prev) => {
            const last = prev[prev.length - 1];
            const heading = last ? computeBearing(last, newPoint) : 0;
            const pointWithHeading: TrackPoint = { ...newPoint, heading };

            setCurrentLocation({
              latitude: pointWithHeading.latitude,
              longitude: pointWithHeading.longitude,
            });

            // Auto-center map on current location
            if (mapRef.current) {
              mapRef.current.animateCamera({
                center: {
                  latitude: pointWithHeading.latitude,
                  longitude: pointWithHeading.longitude,
                },
                zoom: 16,
              });
            }

            // Callback to parent with heading
            if (onLocationUpdate) {
              onLocationUpdate(pointWithHeading);
            }

            return [...prev, pointWithHeading];
          });
        }
      );
    } catch (err) {
      console.warn("Tracking error:", err);
    }
  }, [onLocationUpdate]);

  const stopTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  }, []);

  // Start/stop tracking
  useEffect(() => {
    if (!hasPermission) return;

    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isTracking, hasPermission, startTracking, stopTracking]);

  // Reset track when not tracking
  useEffect(() => {
    if (!isTracking) {
      setTrackPoints([]);
    }
  }, [isTracking]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006A62" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Location permission denied</Text>
        <Text style={styles.errorSubText}>
          Please enable location in settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={
          currentLocation
            ? {
                ...currentLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        showsUserLocation={showLocationLayer}
        showsMyLocationButton={false}
        followsUserLocation={isTracking}
        loadingEnabled
      >
        {/* Polyline for tracked route */}
        {trackPoints.length > 1 && (
          <Polyline
            coordinates={trackPoints}
            strokeColor="#4285F4"
            strokeWidth={4}
            lineJoin="round"
            lineCap="round"
          />
        )}

        {/* Start marker */}
        {trackPoints.length > 0 && (
          <Marker coordinate={trackPoints[0]} title="Start" pinColor="green" />
        )}

        {/* Current position marker: custom cursor (rotated) */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.9 }}
            flat
            zIndex={1000}
            rotation={
              trackPoints.length
                ? trackPoints[trackPoints.length - 1].heading ?? 0
                : 0
            }
            tracksViewChanges={false}
          >
            <Image
              source={require("@/assets/images/arrow.png")}
              style={styles.markerImage}
            />
          </Marker>
        )}
      </MapView>

      <View className="absolute right-3 bottom-6 elevation-md gap-6 flex-col">
        <Pressable
          className="p-3 bg-white rounded-full"
          onPress={async () => {
            try {
              // If we already have a currentLocation, center to it
              if (currentLocation && mapRef.current) {
                mapRef.current.animateCamera({
                  center: currentLocation,
                  zoom: 16,
                });
                return;
              }

              // Otherwise request current position and center map
              const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });
              const pos = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              };
              setCurrentLocation(pos);
              if (mapRef.current) {
                mapRef.current.animateCamera({ center: pos, zoom: 16 });
              }
            } catch (err) {
              console.warn("my-location press error:", err);
            }
          }}
        >
          <MaterialIcons name="my-location" size={24} />
        </Pressable>
        <Pressable className="p-3 bg-white rounded-full">
          <LucideLayers size={24} onPress={() => setShowMapMenu(true)} />
        </Pressable>
      </View>

      {/* Map menu modal (bottom sheet) */}
      <Modal
        visible={showMapMenu || modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => handleCloseSheet()}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => handleCloseSheet()}
          />
        </View>
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: translateY }] },
          ]}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            sheetHeightRef.current = h;
            // when opening, animate from height -> 0
            if (showMapMenu) {
              setModalVisible(true);
              translateY.setValue(h);
              Animated.spring(translateY, {
                toValue: 0,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }).start();
            }
          }}
        >
          <View style={styles.sheetHandle} {...panResponder.panHandlers} />
          <ScrollView contentContainerStyle={styles.sheetContent}>
            <Text style={styles.sheetTitle}>Jenis Peta</Text>

            <View style={styles.mapTypeRow}>
              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "standard" && styles.mapTypeActive,
                ]}
                onPress={() => setMapType("standard")}
              >
                <View style={styles.mapTypePreview} />
                <Text style={styles.mapTypeLabel}>Standar</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "satellite" && styles.mapTypeActive,
                ]}
                onPress={() => setMapType("satellite")}
              >
                <View
                  style={[styles.mapTypePreview, { backgroundColor: "#ccc" }]}
                />
                <Text style={styles.mapTypeLabel}>Satelit</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "hybrid" && styles.mapTypeActive,
                ]}
                onPress={() => setMapType("hybrid")}
              >
                <View
                  style={[
                    styles.mapTypePreview,
                    { backgroundColor: "#bfbfbf" },
                  ]}
                />
                <Text style={styles.mapTypeLabel}>Hibrida</Text>
              </Pressable>
            </View>

            <Text style={[styles.sheetTitle, { marginTop: 18 }]}>Heatmap</Text>
            <View style={styles.heatmapRow}>
              <Pressable
                style={[
                  styles.heatmapItem,
                  heatmapOption === "global" && styles.heatmapActive,
                ]}
                onPress={() => setHeatmapOption("global")}
              >
                <View style={styles.heatmapPreview} />
                <Text style={styles.heatmapLabel}>Global</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.heatmapItem,
                  heatmapOption === "weekly" && styles.heatmapActive,
                ]}
                onPress={() => {
                  /* locked for demo */
                }}
              >
                <View style={styles.heatmapPreviewLocked}>
                  <Text>🔒</Text>
                </View>
                <Text style={styles.heatmapLabel}>Mingguan</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.heatmapItem,
                  heatmapOption === "night" && styles.heatmapActive,
                ]}
                onPress={() => {
                  /* locked */
                }}
              >
                <View style={styles.heatmapPreviewLocked}>
                  <Text>🔒</Text>
                </View>
                <Text style={styles.heatmapLabel}>Malam</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.heatmapItem,
                  heatmapOption === "private" && styles.heatmapActive,
                ]}
                onPress={() => {
                  /* locked */
                }}
              >
                <View style={styles.heatmapPreviewLocked}>
                  <Text>🔒</Text>
                </View>
                <Text style={styles.heatmapLabel}>Pribadi</Text>
              </Pressable>
            </View>

            <Text style={[styles.sheetTitle, { marginTop: 18 }]}>Lapisan</Text>
            <View style={styles.layerRow}>
              <Text style={styles.layerLabel}>Titik Lokasi</Text>
              <Switch
                value={showLocationLayer}
                onValueChange={(v) => setShowLocationLayer(v)}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  // custom cursor marker styles
  cursorWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  cursorTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#4285F4",
    transform: [{ rotate: "180deg" }],
    marginBottom: -4,
  },
  cursorCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4285F4",
    position: "absolute",
    bottom: 2,
  },
  // arrow marker styles
  arrowWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowTail: {
    width: 4,
    height: 16,
    backgroundColor: "#4285F4",
    borderRadius: 2,
    marginBottom: -2,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#4285F4",
    transform: [{ translateY: -6 }],
  },
  mapControls: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 8,
    elevation: 4,
  },
  controlButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  controlButtonActive: {
    backgroundColor: "#4285F4",
  },
  controlText: {
    fontSize: 12,
    color: "#222",
  },
  markerImage: {
    width: 44,
    height: 44,
    transform: [{ translateY: 2 }],
  },
  // modal / sheet styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 48,
    height: 6,
    backgroundColor: "#444",
    borderRadius: 4,
    alignSelf: "center",
    marginVertical: 10,
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  sheetTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  mapTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapTypeItem: {
    width: 88,
    alignItems: "center",
  },
  mapTypeActive: {
    borderWidth: 2,
    borderColor: "#ff6a00",
    padding: 6,
    borderRadius: 8,
  },
  mapTypePreview: {
    width: 64,
    height: 48,
    backgroundColor: "#2b2b2b",
    borderRadius: 8,
    marginBottom: 8,
  },
  mapTypeLabel: {
    color: "#000",
    fontSize: 12,
  },
  heatmapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  heatmapItem: {
    width: 72,
    alignItems: "center",
  },
  heatmapActive: {
    borderWidth: 2,
    borderColor: "#ff6a00",
    padding: 6,
    borderRadius: 8,
  },
  heatmapPreview: {
    width: 56,
    height: 40,
    backgroundColor: "#2b2b2b",
    borderRadius: 6,
    marginBottom: 6,
  },
  heatmapPreviewLocked: {
    width: 56,
    height: 40,
    backgroundColor: "#222",
    borderRadius: 6,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapLabel: {
    color: "#000",
    fontSize: 12,
  },
  layerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  layerLabel: {
    color: "#000",
    fontSize: 16,
  },
});
