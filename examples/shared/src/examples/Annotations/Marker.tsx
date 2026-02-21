import {
  type Anchor,
  type LngLat,
  Map,
  Marker,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = StyleSheet.create({
  marker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  markerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  absoluteView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 100,
    width: 120,
  },

  anchor: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
  },
});

function MarkerExample() {
  const [zIndices, setZIndices] = useState([1, 2, 3]);
  const [touchableCount, setTouchableCount] = useState(0);
  const [pressableCount, setPressableCount] = useState(0);
  const [anchor, setAnchor] = useState<Anchor>("center");

  const rotateZIndex = () => {
    setZIndices((prev) => [prev[2]!, prev[0]!, prev[1]!]);
  };

  const cycleAnchor = () => {
    setAnchor((prev) => {
      if (prev === "center") return "bottom";
      if (prev === "bottom") return "top";
      return "center";
    });
  };

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        {/*
            zIndex test markers
            https://github.com/maplibre/maplibre-react-native/issues/998
         */}
        {(
          [
            [-15, 70],
            [15, 70],
            [0, 60],
          ] as LngLat[]
        ).map((coordinates, index) => (
          <Marker
            key={`zindex-${index}`}
            lngLat={coordinates}
            style={{ zIndex: zIndices[index] }}
          >
            <Pressable
              onPress={rotateZIndex}
              style={[styles.marker, { backgroundColor: colors[index] }]}
            >
              <Text style={styles.markerText}>zIndex</Text>
              <Text style={styles.markerText}>{zIndices[index]}</Text>
            </Pressable>
          </Marker>
        ))}

        {/*
            Absolute view clipping test marker
            https://github.com/maplibre/maplibre-react-native/issues/642
         */}
        <Marker lngLat={[-60, 0]}>
          <View style={styles.marker}>
            <View style={styles.absoluteView}>
              <Text style={[styles.markerText, { color: "#000000" }]}>
                Absolute View Clipping Test
              </Text>
            </View>
            <View style={[styles.marker, { backgroundColor: "#9B59B6" }]}>
              <Text style={styles.markerText}>Clip</Text>
            </View>
          </View>
        </Marker>

        {/*
            Anchor test marker
            https://github.com/maplibre/maplibre-react-native/issues/1158
        */}
        <Marker lngLat={[0, -50]} anchor={anchor}>
          <>
            <Pressable
              style={[styles.marker, { backgroundColor: "#F39C12" }]}
              onPress={cycleAnchor}
            >
              <Text style={styles.markerText}>Anchor</Text>
              <Text style={styles.markerText}>{anchor}</Text>
            </Pressable>
            <View
              style={[
                styles.anchor,
                {
                  left: 100 / 2 - 4,
                  top:
                    (anchor === "top" ? 0 : anchor === "bottom" ? 1 : 0.5) *
                      100 -
                    4,
                },
              ]}
            />
          </>
        </Marker>

        {/*
            Touch interaction test markers
            https://github.com/maplibre/maplibre-react-native/issues/557
            https://github.com/maplibre/maplibre-react-native/issues/1018
         */}
        <Marker lngLat={[60, 0]}>
          <View style={{ alignItems: "center", gap: 4 }}>
            <TouchableOpacity
              style={[styles.marker, { backgroundColor: "#2ECC71" }]}
              onPress={() => {
                setTouchableCount((c) => c + 1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.markerText}>Touch</Text>
              <Text style={styles.markerText}>{touchableCount}</Text>
            </TouchableOpacity>

            <Pressable
              style={({ pressed }) => [
                styles.marker,
                {
                  backgroundColor: pressed ? "#1ABC9C" : "#3498DB",
                },
              ]}
              onPress={() => {
                setPressableCount((c) => c + 1);
              }}
            >
              <Text style={styles.markerText}>Press</Text>
              <Text style={styles.markerText}>{pressableCount}</Text>
            </Pressable>
          </View>
        </Marker>
      </Map>
    </>
  );
}

export { MarkerExample as Marker };
