import { StaticMapImageManager } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapLibreDemoStyleBlue from "@/assets/styles/maplibre-demo-style-blue.json";
import { EU_BOUNDS, EU_CENTER_COORDINATES } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  image: {
    flex: 1,
  },

  spinnerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export function CreateStaticMapWithoutMap() {
  const [files, setFiles] = useState<string[]>();

  const createStaticMapImages = async () => {
    const { width, height } = Dimensions.get("window");

    setFiles([
      await StaticMapImageManager.createImage({
        center: EU_CENTER_COORDINATES,
        zoom: 3,
        pitch: 60,
        bearing: 20,
        mapStyle: MAPLIBRE_DEMO_STYLE,
        width,
        height: height / 2,
        output: "file",
        logo: true,
      }),
      await StaticMapImageManager.createImage({
        bounds: EU_BOUNDS,
        mapStyle: MapLibreDemoStyleBlue,
        width,
        height: height / 2,
        output: "file",
        logo: true,
      }),
    ]);
  };

  useEffect(() => {
    createStaticMapImages();
  }, []);

  if (!files) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Generating Static Map</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {files.map((file) => (
        <Image
          key={file}
          source={{ uri: file }}
          resizeMode="contain"
          style={styles.image}
        />
      ))}
    </View>
  );
}
