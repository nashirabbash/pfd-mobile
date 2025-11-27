import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../contexts/ThemeContext";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type PlaceSuggestion = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export default function MapsLayout() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<PlaceSuggestion[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "route" | "distance" | "result" | "elevation"
  >("route");
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">(
    "satellite"
  );
  const [show3D, setShow3D] = useState(false);
  const [showMapMenu, setShowMapMenu] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { paperTheme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetHeightRef = useRef(300);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search places using Google Places API
  const searchPlaces = async (query: string) => {
    if (!query || query.trim().length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    try {
      // Using Google Places Autocomplete API
      const apiKey = process.env.GOOGLE_API_KEY;
      const input = encodeURIComponent(query);
      const location = currentLocation
        ? `${currentLocation.latitude},${currentLocation.longitude}`
        : "";

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}&location=${location}&radius=50000&language=id`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        setSearchSuggestions(data.predictions);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.warn("Place search error:", error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (placeId: string, description: string) => {
    setSearchQuery(description);
    setShowSuggestions(false);
    setSearchSuggestions([]);

    try {
      // Get place details to get coordinates
      const apiKey = process.env.GOOGLE_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        const newLocation = { latitude: lat, longitude: lng };

        setCurrentLocation(newLocation);

        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: newLocation,
            zoom: 16,
          });
        }
      }
    } catch (error) {
      console.warn("Place details error:", error);
    }
  };

  // Debounced search
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 500);
  };

  // Sample route data (you can replace with real data)
  const sampleRoute: Coordinate[] = [
    { latitude: -7.797068, longitude: 110.370529 },
    { latitude: -7.7975, longitude: 110.371 },
    { latitude: -7.798, longitude: 110.3715 },
    { latitude: -7.7985, longitude: 110.372 },
    { latitude: -7.799, longitude: 110.3725 },
    { latitude: -7.7995, longitude: 110.373 },
    { latitude: -7.8, longitude: 110.3735 },
  ];

  // Sample markers (food/drink stops)
  const sampleMarkers = [
    {
      id: 1,
      coordinate: { latitude: -7.7975, longitude: 110.371 },
      type: "food",
    },
    {
      id: 2,
      coordinate: { latitude: -7.799, longitude: 110.3725 },
      type: "drink",
    },
    {
      id: 3,
      coordinate: { latitude: -7.8, longitude: 110.3735 },
      type: "food",
    },
  ];

  // Pan responder for bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationY } = evt.nativeEvent;
        return locationY < 50;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { locationY } = evt.nativeEvent;
        return locationY < 50 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const dy = gestureState.dy;
        // Allow both up and down dragging
        translateY.setValue(dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dy = gestureState.dy;
        const velocity = gestureState.vy;

        // Snap to positions: expanded (negative) or collapsed (0)
        if (dy < -50 || velocity < -0.5) {
          // Expand up
          Animated.spring(translateY, {
            toValue: -200,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        } else if (dy > 50 || velocity > 0.5) {
          // Collapse down
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        } else {
          // Return to original position
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
          // Default to sample location if no permission
          setCurrentLocation({ latitude: -7.797068, longitude: 110.370529 });
          setLoading(false);
        }
      } catch (err) {
        console.warn("Location permission error:", err);
        setCurrentLocation({ latitude: -7.797068, longitude: 110.370529 });
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        pitchEnabled={show3D}
        rotateEnabled={show3D}
        camera={
          show3D && currentLocation
            ? {
                center: currentLocation,
                pitch: 45,
                heading: 0,
                altitude: 1000,
                zoom: 16,
              }
            : undefined
        }
        initialRegion={
          currentLocation
            ? {
                ...currentLocation,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : undefined
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Route polyline */}
        {sampleRoute.length > 0 && (
          <Polyline
            coordinates={sampleRoute}
            strokeColor="#006A62"
            strokeWidth={5}
            lineJoin="round"
            lineCap="round"
          />
        )}

        {/* Start marker */}
        {sampleRoute.length > 0 && (
          <Marker coordinate={sampleRoute[0]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.startMarker}>
              <MaterialIcons name="play-arrow" size={16} color="#fff" />
            </View>
          </Marker>
        )}

        {/* End marker */}
        {sampleRoute.length > 1 && (
          <Marker
            coordinate={sampleRoute[sampleRoute.length - 1]}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.endMarker}>
              <MaterialIcons name="stop" size={16} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Sample markers (food/drink) */}
        {sampleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.poiMarker}>
              <Text style={styles.poiEmoji}>
                {marker.type === "food" ? "🍔" : "☕"}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View className="absolute top-14 px-6 w-full">
        <View style={{ position: "relative", zIndex: 100 }}>
          <View style={styles.searchBar}>
            <Pressable style={styles.categoryButton}>
              <MaterialIcons name="directions-run" size={24} color="#006A62" />
              <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
            </Pressable>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari lokasi"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => {
                if (searchSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery("");
                  setSearchSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <MaterialIcons name="close" size={20} color="#999" />
              </Pressable>
            )}
            <Pressable
              style={styles.searchIconButton}
              onPress={() => {
                if (searchQuery.trim().length >= 3) {
                  searchPlaces(searchQuery);
                }
              }}
            >
              <MaterialIcons name="search" size={24} color="#006A62" />
            </Pressable>
          </View>

          {/* Search suggestions dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              >
                {isSearching && (
                  <View style={styles.suggestionItem}>
                    <ActivityIndicator size="small" color="#006A62" />
                    <Text style={styles.suggestionText}>Mencari...</Text>
                  </View>
                )}
                {searchSuggestions.map((place) => (
                  <Pressable
                    key={place.place_id}
                    style={styles.suggestionItem}
                    onPress={() =>
                      handlePlaceSelect(place.place_id, place.description)
                    }
                  >
                    <MaterialIcons name="place" size={20} color="#666" />
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionMainText}>
                        {place.structured_formatting.main_text}
                      </Text>
                      <Text style={styles.suggestionSecondaryText}>
                        {place.structured_formatting.secondary_text}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Tab buttons */}
        <View className="hidden">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
          >
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "route" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("route")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "route" && styles.tabTextActive,
                ]}
              >
                Route
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "distance" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("distance")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "distance" && styles.tabTextActive,
                ]}
              >
                Panjang
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "result" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("result")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "result" && styles.tabTextActive,
                ]}
              >
                Kesulitan
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "elevation" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("elevation")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "elevation" && styles.tabTextActive,
                ]}
              >
                Elevasi
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Right side buttons */}
        <View className="absolute right-4 gap-5 bottom-[-640]">
          <Pressable
            style={styles.roundButton}
            onPress={() => setShowMapMenu(!showMapMenu)}
          >
            <MaterialIcons name="layers" size={24} color="#333" />
          </Pressable>
          <Pressable
            style={[
              styles.roundButton,
              show3D && { backgroundColor: "#006A62" },
            ]}
            onPress={() => {
              setShow3D(!show3D);
              if (!show3D && currentLocation && mapRef.current) {
                // Enable 3D view
                mapRef.current.animateCamera({
                  center: currentLocation,
                  pitch: 45,
                  heading: 0,
                  altitude: 1000,
                  zoom: 16,
                });
              } else if (show3D && currentLocation && mapRef.current) {
                // Disable 3D view (return to 2D)
                mapRef.current.animateCamera({
                  center: currentLocation,
                  pitch: 0,
                  heading: 0,
                  altitude: 1000,
                  zoom: 16,
                });
              }
            }}
          >
            <Text style={[styles.threeDText, show3D && { color: "#fff" }]}>
              {show3D ? "2D" : "3D"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.roundButton}
            onPress={async () => {
              try {
                if (currentLocation && mapRef.current) {
                  mapRef.current.animateCamera({
                    center: currentLocation,
                    zoom: 16,
                  });
                } else if (hasPermission) {
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
                }
              } catch (err) {
                console.warn("GPS fixed error:", err);
              }
            }}
          >
            <MaterialIcons name="gps-fixed" size={24} color="#333" />
          </Pressable>
        </View>
      </View>
      {/* Search bar */}

      {/* Map Layer Menu Modal */}
      <Modal
        visible={showMapMenu}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMapMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMapMenu(false)}
        >
          <View style={styles.mapMenuContainer}>
            <Text style={styles.mapMenuTitle}>Jenis Peta</Text>

            <View style={styles.mapTypeRow}>
              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "standard" && styles.mapTypeActive,
                ]}
                onPress={() => {
                  setMapType("standard");
                  setShowMapMenu(false);
                }}
              >
                <View style={styles.mapTypePreview} />
                <Text style={styles.mapTypeLabel}>Standar</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "satellite" && styles.mapTypeActive,
                ]}
                onPress={() => {
                  setMapType("satellite");
                  setShowMapMenu(false);
                }}
              >
                <View
                  style={[styles.mapTypePreview, { backgroundColor: "#555" }]}
                />
                <Text style={styles.mapTypeLabel}>Satelit</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.mapTypeItem,
                  mapType === "hybrid" && styles.mapTypeActive,
                ]}
                onPress={() => {
                  setMapType("hybrid");
                  setShowMapMenu(false);
                }}
              >
                <View
                  style={[styles.mapTypePreview, { backgroundColor: "#777" }]}
                />
                <Text style={styles.mapTypeLabel}>Hibrida</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom sheet */}
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
  searchContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bookmarkButton: {
    padding: 8,
  },
  searchIconButton: {
    padding: 8,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 300,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 2000,
    overflow: "hidden",
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 13,
    color: "#666",
  },
  suggestionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  tabContainer: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  tabScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabButtonActive: {
    backgroundColor: "#006A62",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  tabTextActive: {
    color: "#fff",
  },
  rightButtons: {
    position: "absolute",
    right: 12,
    bottom: 380,
    gap: 12,
    zIndex: 8,
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  threeDText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    minHeight: 300,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 12,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  routeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  routeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  routeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  routeStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  difficultyBadge: {
    backgroundColor: "#90EE90",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2d5016",
  },
  routeStatsText: {
    fontSize: 13,
    color: "#666",
  },
  routeLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  routeFrom: {
    fontSize: 13,
    color: "#006A62",
    fontWeight: "600",
  },
  specialSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  specialText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  startMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  endMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#006A62",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  poiMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#006A62",
  },
  poiEmoji: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapMenuContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  mapMenuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  mapTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  mapTypeItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  mapTypeActive: {
    borderColor: "#006A62",
    backgroundColor: "#FFF5F0",
  },
  mapTypePreview: {
    width: 60,
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  mapTypeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});
