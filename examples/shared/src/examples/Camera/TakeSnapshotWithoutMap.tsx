import { SnapshotManager } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  snapshot: {
    flex: 1,
  },
  spinnerContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
});

export function TakeSnapshotWithoutMap() {
  const [snapshotURI, setSnapshotURI] = useState<string | null>(null);

  const takeSnapshot = async () => {
    const { width, height } = Dimensions.get("window");

    const uri = await SnapshotManager.takeSnap({
      centerCoordinate: [-74.12641, 40.797968],
      width,
      height,
      zoomLevel: 3,
      pitch: 30,
      heading: 20,
      styleURL: "https://demotiles.maplibre.org/style.json",
      writeToDisk: true,
    });

    setSnapshotURI(uri);
  };

  useEffect(() => {
    takeSnapshot();
  }, []);

  if (!snapshotURI) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Generating Snapshot</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: snapshotURI }}
        resizeMode="contain"
        style={styles.snapshot}
      />
    </View>
  );
}
