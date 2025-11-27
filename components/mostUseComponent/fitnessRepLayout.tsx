import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

export default function FitnessRepLayout() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        alignItems: "center",
        padding: 16,
        flexDirection: "column",
        width: "100%",
        gap: 12,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full h-[324px] bg-white rounded-xl flex justify-center items-center gap-2.5">
        <RadarChart />
      </View>

      {/* Carousel for fitness metric cards */}
      <Carousel />
      <ButtonSave />
    </ScrollView>
  );
}

function RadarChart() {
  // Aggregate data from carousel for radar chart
  const radarData = [
    { label: "Body Composition", value: 5 },
    { label: "Cardiovascular", value: 5 },
    { label: "Flexibility", value: 5 },
    { label: "Strength & Power", value: 5 },
    { label: "Reaction Time", value: 8 },
    { label: "Speed & Agility", value: 9 },
    { label: "Endurance", value: 6.5 },
  ];

  const size = 280;
  const center = size / 2;
  const radius = 100;
  const maxValue = 10;

  // Calculate points for radar chart
  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2;
    const valueRadius = (value / maxValue) * radius;
    const x = center + valueRadius * Math.cos(angle);
    const y = center + valueRadius * Math.sin(angle);
    return { x, y };
  };

  // Calculate label positions
  const getLabelPoint = (index: number) => {
    const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y };
  };

  // Create polygon points string
  const polygonPoints = radarData
    .map((item, index) => {
      const point = getPoint(index, item.value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  // Create grid circles
  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <Circle
            key={level}
            cx={center}
            cy={center}
            r={(level / maxValue) * radius}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {radarData.map((_, index) => {
          const point = getPoint(index, maxValue);
          return (
            <Line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={polygonPoints}
          fill="#006A62"
          fillOpacity={0.3}
          stroke="#006A62"
          strokeWidth="2"
        />

        {/* Data points */}
        {radarData.map((item, index) => {
          const point = getPoint(index, item.value);
          return (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#006A62"
            />
          );
        })}

        {/* Labels */}
        {radarData.map((item, index) => {
          const labelPoint = getLabelPoint(index);
          return (
            <SvgText
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize="12"
              fill="#666"
              fontFamily="Plus-Jakarta-Sans-Medium"
            >
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

export function Carousel() {
  const screenWidth = Dimensions.get("window").width;
  const data = [
    {
      id: "card-1",
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
      id: "card-2",
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
  const [activeIndex, setActiveIndex] = useState(0);
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ height: "auto" }}
        renderItem={({ item, index }) => (
          <View
            style={[
              {
                width: screenWidth - 32,
                height: "auto",
                marginHorizontal: 16,
                paddingHorizontal: 24,
                paddingVertical: 28,
                backgroundColor: "white",
                borderRadius: 12,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 20,
              },
            ]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.metricsContainer}>
              {item.metrics.map((metric: any, metricIndex: number) => (
                <View key={metricIndex} style={styles.metricRow}>
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
      />

      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                opacity: i === activeIndex ? 1 : 0.3,
                transform: [{ scale: i === activeIndex ? 1.1 : 1 }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function ButtonSave() {
  return (
    <View className="w-full flex flex-row items-center justify-center gap-4">
      <IconButton
        icon="share"
        mode="outlined"
        size={32}
        onPress={() => {
          // Handle share action
        }}
      />
      <IconButton
        icon="content-save"
        mode="contained"
        size={32}
        onPress={() => {
          // Handle save action
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    width: "100%",
    height: "auto",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  radarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
  },
  metricsContainer: {
    gap: 16,
    width: "100%",
  },
  metricRow: {
    gap: 8,
    width: "100%",
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
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
    fontFamily: "Plus-Jakarta-Sans-SemiBold",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFilled: {
    height: "100%",
    backgroundColor: "#006A62",
    borderRadius: 8,
  },
});
