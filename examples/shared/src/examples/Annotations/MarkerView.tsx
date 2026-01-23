import {
  Camera,
  type LngLat,
  MapView,
  MarkerView,
  PointAnnotation,
} from "@maplibre/maplibre-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = StyleSheet.create({
  touchableContainer: {
    borderColor: "black",
    borderWidth: 1.0,
    width: 60,
  },
  touchable: {
    backgroundColor: "blue",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  touchableText: {
    color: "white",
    fontWeight: "bold",
  },
});

interface AnnotationContentProps {
  title: string;
}

function AnnotationContent({ title }: AnnotationContentProps) {
  return (
    <View style={styles.touchableContainer}>
      <Text>{title}</Text>
      <TouchableOpacity style={styles.touchable}>
        <Text style={styles.touchableText}>Btn</Text>
      </TouchableOpacity>
    </View>
  );
}

const COORDINATES = [
  [-73.99155, 40.73581],
  [-73.99155, 40.73681],
] as const satisfies [LngLat, LngLat];

function MarkerViewExample() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera zoom={16} center={COORDINATES[0]} />

      <PointAnnotation coordinate={COORDINATES[1]} id="pt-ann">
        <AnnotationContent title="this is a point annotation" />
      </PointAnnotation>

      <MarkerView coordinate={COORDINATES[0]}>
        <AnnotationContent title="this is a marker view" />
      </MarkerView>
    </MapView>
  );
}

export { MarkerViewExample as MarkerView };
