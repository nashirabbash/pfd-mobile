import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 72; // 24px padding on each side
const CARD_SPACING = 24;
const SIDE_SPACING = 24;

export default function CardFitnessMetric() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const data = [
    {
      title: "Physical Condition",
      metrics: [
        {
          name: "Body Composition",
          progress: 0.5,
          score: 5,
        },
        {
          name: "Cardiovascular Endurance",
          progress: 0.5,
          score: 5,
        },
        {
          name: "Flexibility",
          progress: 0.5,
          score: 5,
        },
        {
          name: "Strength & Power",
          progress: 0.5,
          score: 5,
        },
      ],
    },
    {
      title: "Performance",
      metrics: [
        {
          name: "Reaction Time",
          progress: 0.8,
          score: 8,
        },
        {
          name: "Speed & Agility",
          progress: 0.9,
          score: 9,
        },
        {
          name: "Endurance",
          progress: 0.65,
          score: 6.5,
        },
      ],
    },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={CARD_WIDTH + SIDE_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACING,
          paddingBottom: 12,
        }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.metricsContainer}>
              {item.metrics.map((metric: any, index: number) => (
                <View key={index} style={styles.metricRow}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{metric.name}</Text>
                    <Text style={styles.metricScore}>{metric.score}/10</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFilled,
                        { width: `${metric.progress * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
  metricsContainer: {
    gap: 16,
  },
  metricRow: {
    gap: 1,
    width: "100%",
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  metricLabel: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Plus-Jakarta-Sans-Regular",
    fontWeight: "400",
  },
  metricScore: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    position: "relative",
    overflow: "visible",
  },
  progressBarFilled: {
    height: "100%",
    backgroundColor: "#006A62",
    borderRadius: 8,
  },
  progressDot: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -6 }],
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#006A62",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  paginationDotActive: {
    backgroundColor: "#006A62",
    width: 24,
  },
});
