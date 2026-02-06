import { GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { StyleSheet, Text, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const ORIGIN_POINT: GeoJSON.Feature = {
  type: "Feature",
  geometry: { type: "Point", coordinates: [0, 0] },
  properties: {},
};

export function DefaultCenter() {
  return (
    <View style={styles.container}>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <GeoJSONSource data={ORIGIN_POINT}>
          <Layer
            id="origin-circle"
            type="circle"
            style={{ circleRadius: 12, circleColor: "red" }}
          />
        </GeoJSONSource>
      </Map>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          No Camera component. The red dot at [0, 0] should be centered.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
});
