import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { listData, data as vitalData } from "./vitalSignConstants";

export default function VitalSignLayout() {
  const paperTheme = useTheme();

  const Container = ({ item, index }: any) => {
    // Ambil data terbaru (entry terakhir)
    const latest =
      vitalData && vitalData.length > 0
        ? vitalData[vitalData.length - 1]
        : undefined;

    let displayValue: string | number | undefined = undefined;
    if (latest) {
      switch (item.id) {
        case 1:
          displayValue = latest.heartRate;
          break;
        case 2:
          displayValue = latest.bloodPressure
            ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}`
            : undefined;
          break;
        case 3:
          displayValue = latest.breathRate;
          break;
        case 4:
          displayValue = latest.spo2;
          break;
        case 5:
          displayValue = latest.lactate;
          break;
        case 6:
          displayValue = latest.glucoseLevel;
          break;
        case 7:
          displayValue = latest.vo2Max;
          break;
        default:
          displayValue = undefined;
      }
    }

    // Siapkan data time-series untuk LineChart: ambil semua entry, urutkan berdasarkan timeStamp
    let chartData: { value: number }[] = [];
    if (vitalData && vitalData.length > 0) {
      const sorted = [...vitalData].sort(
        (a, b) =>
          new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
      );
      for (const entry of sorted) {
        let num: number | undefined;
        switch (item.id) {
          case 1:
            num = entry.heartRate as number | undefined;
            break;
          case 2:
            num = entry.bloodPressure
              ? entry.bloodPressure.systolic
              : undefined;
            break;
          case 3:
            num = entry.breathRate as number | undefined;
            break;
          case 4:
            num = entry.spo2 as number | undefined;
            break;
          case 5:
            num = entry.lactate as number | undefined;
            break;
          case 6:
            num = entry.glucoseLevel as number | undefined;
            break;
          case 7:
            num = entry.vo2Max as number | undefined;
            break;
          default:
            num = undefined;
        }
        if (typeof num === "number" && !isNaN(num)) {
          chartData.push({ value: num });
        }
      }
    }

    return (
      <View style={styles.container}>
        <View>
          <View
            style={{
              borderRadius: 200,
              backgroundColor: "#006A62",
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              height: 32,
            }}
          >
            <MaterialIcons name={item.icons as any} size={24} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.textStyle}>
            <Text style={styles.value}>
              {displayValue !== undefined && displayValue !== null
                ? displayValue
                : "--"}
            </Text>
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
          <View style={{ left: -48 }}>
            <LineChart
              areaChart
              data={chartData}
              hideAxesAndRules
              curved
              width={140}
              height={100}
              maxValue={200}
              hideDataPoints
            />
          </View>
        </View>
      </View>
    );
  };

  const HeartRateCard = () => {
    // Find the heart rate meta from listData
    const hrMeta = listData.find((it) => it.id === 1);
    if (!hrMeta) return null;

    // Latest heart rate value
    const latest =
      vitalData && vitalData.length > 0
        ? vitalData[vitalData.length - 1]
        : undefined;
    const displayValue =
      latest && typeof latest.heartRate === "number"
        ? latest.heartRate
        : undefined;

    // Chart data for heart rate only
    let chartData: { value: number }[] = [];
    if (vitalData && vitalData.length > 0) {
      const sorted = [...vitalData].sort(
        (a, b) =>
          new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
      );
      for (const entry of sorted) {
        const num =
          typeof entry.heartRate === "number" ? entry.heartRate : undefined;
        if (typeof num === "number" && !isNaN(num))
          chartData.push({ value: num });
      }
    }

    return (
      <View style={[styles.container, styles.heartrateContainer]}>
        <View>
          <View
            style={{
              borderRadius: 200,
              backgroundColor: "#006A62",
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              height: 32,
            }}
          >
            <MaterialIcons
              name={hrMeta.icons as any}
              size={20}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>{hrMeta.name}</Text>
          <View style={styles.textStyle}>
            <Text style={styles.value}>
              {displayValue !== undefined && displayValue !== null
                ? displayValue
                : "--"}
            </Text>
            <Text style={styles.unit}>{hrMeta.unit}</Text>
          </View>
          <View style={{ left: -48 }}>
            <LineChart
              areaChart
              data={chartData}
              hideAxesAndRules
              curved
              width={Dimensions.get("window").width - 64}
              height={100}
              maxValue={200}
              hideDataPoints
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.screenContainer,
        { backgroundColor: paperTheme.colors.surface },
      ]}
    >
      <HeartRateCard />
      <FlatList
        data={listData.filter((it) => it.id !== 1)}
        renderItem={Container}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    width: Dimensions.get("window").width / 2 - 20,
    margin: 10,
    padding: 16,
    height: 240,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  heartrateContainer: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 16,
    fontFamily: "Plus-Jakarta-Sans-Medium",
    alignSelf: "stretch",
    justifyContent: "flex-start",
  },
  unit: {
    fontSize: 14,
    fontFamily: "Plus-Jakarta-Sans-Medium",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    // jangan paksa elemen mengambil ruang; biarkan ukurannya sesuai konten
  },
  textStyle: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start",
    gap: 2,
  },
  value: {
    fontSize: 22,
    fontFamily: "Plus-Jakarta-Sans-Bold",
    alignSelf: "stretch",
    justifyContent: "flex-start",
  },
});
