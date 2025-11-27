import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { IconButton, Text } from "react-native-paper";
import { listData, data as vitalData } from "./vitalSignConstants";

const GpsData = [
  {
    title: "Duration",
    value: "45",
    Satuan: "min",
  },
  {
    title: "Distance",
    value: "5.2",
    Satuan: "km",
  },
  {
    title: "Pace",
    value: "8,45",
    Satuan: "min/km",
  },
  {
    title: "Speed",
    value: "12",
    Satuan: "km/h",
  },
];
// vitalSignData removed — not used in this component

export default function ActivPrevLayoutt() {
  const Router = useRouter();

  const handleClick = ({ path }: any) => {
    Router.push(path);
  };
  // const paperTheme = useTheme(); // not used
  // const heartRateData = vitalSignData[0]; // not used
  const gpsDataCard = () => {
    return (
      <View className="w-full rounded-xl bg-white h-fit flex flex-row justify-between items-center">
        {GpsData.map((item, index) => (
          <View
            key={index}
            className="flex flex-1 flex-col items-center justify-center p-4"
          >
            <View className="flex flex-row items-baseline gap-1">
              <Text className="text-lg font-[Plus-Jakarta-Sans-SemiBold]">
                {item.value}
              </Text>
              <Text className="text-xs font-[Plus-Jakarta-Sans-Regular]">
                {item.Satuan}
              </Text>
            </View>
            <Text className="text-xs font-[Plus-Jakarta-Sans-Medium]">
              {item.title}
            </Text>
          </View>
        ))}
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

  // vitalMetricCard removed: main FlatList below now renders the metric cards.

  const SeeFitnessReport = () => {
    return (
      <View className="w-full h-fit px-3.5 py-3 bg-white rounded-xl flex flex-row justify-between items-center">
        <Text>See Fitness Report</Text>
        <IconButton
          icon="chevron-right"
          size={16}
          onPress={() =>
            handleClick({ path: "/(screens)/record/fitnessReport" })
          }
        />
      </View>
    );
  };

  const ButtonSave = () => {
    return (
      <View
        className="flex flex-row justify-center w-full h-fit items-center
      gap-4"
      >
        <IconButton
          icon="share"
          size={32}
          mode="outlined"
          onPress={() => console.log("Pressed")}
        />
        <IconButton
          icon="content-save"
          mode="contained"
          size={32}
          onPress={() => console.log("Pressed")}
        />
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={listData.filter((it) => it.id !== 1)}
        renderItem={Container}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={() => (
          <View style={{ gap: 12 }}>
            {gpsDataCard()}
            {HeartRateCard()}
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ gap: 12 }}>
            {SeeFitnessReport()}
            {ButtonSave()}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignContent: "center",
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
