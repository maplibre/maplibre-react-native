import {
  type Anchor,
  Camera,
  type LngLat,
  MapView,
  MarkerView,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Bubble } from "@/components/Bubble";
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

  // Callout/overflow styles for clipping test (#642)
  calloutContainer: {
    alignItems: "center",
  },

  callout: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    // Position the callout above the marker
    position: "absolute",
    bottom: 100,
    width: 120,
  },

  calloutText: {
    fontSize: 10,
    textAlign: "center",
  },

  anchorDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
  },

  controls: {
    gap: 8,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    marginTop: 4,
  },
});

const CENTER: LngLat = [-73.99155, 40.7368];

const MARKER_COORDS = [
  // zIndex test - Venn diagram arrangement (#998)
  [-73.99155, 40.73705], // Red - top center
  [-73.99185, 40.73665], // Teal - bottom left
  [-73.99125, 40.73665], // Blue - bottom right
  [-73.9915, 40.7382], // Top - clipping test (#642)
  [-73.9915, 40.7358], // Bottom - anchor test (#1158)
  [-73.9905, 40.7368], // Right of center - touch test (#557, #1018)
] as const satisfies LngLat[];

function MarkerViewExample() {
  const [zIndices, setZIndices] = useState([1, 2, 3]);
  const [touchableCount, setTouchableCount] = useState(0);
  const [pressableCount, setPressableCount] = useState(0);
  const [pressInCount, setPressInCount] = useState(0);
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
  const colorNames = ["Red", "Teal", "Blue"];

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera
          initialViewState={{
            center: CENTER,
            zoom: 16,
          }}
        />

        {/* zIndex test markers (#998) - overlapping to show stacking order */}
        {[0, 1, 2].map((i) => (
          <MarkerView
            key={`zindex-${i}`}
            lngLat={MARKER_COORDS[i]!}
            style={{ zIndex: zIndices[i] }}
          >
            <View style={[styles.marker, { backgroundColor: colors[i] }]}>
              <Text style={styles.markerText}>{colorNames[i]}</Text>
              <Text style={[styles.markerText, { fontSize: 10 }]}>
                z:{zIndices[i]}
              </Text>
            </View>
          </MarkerView>
        ))}

        {/* Clipping test marker (#642) */}
        <MarkerView lngLat={MARKER_COORDS[3]!}>
          <View style={styles.calloutContainer}>
            {/* This callout is positioned OUTSIDE the marker bounds */}
            <View style={styles.callout}>
              <Text style={styles.calloutText}>
                Callout above marker (tests clipping #642)
              </Text>
            </View>
            <View style={[styles.marker, { backgroundColor: "#9B59B6" }]}>
              <Text style={styles.markerText}>Clip</Text>
            </View>
          </View>
        </MarkerView>

        {/* Anchor test marker (#1158) */}
        <MarkerView lngLat={MARKER_COORDS[4]!} anchor={anchor}>
          <View>
            <View style={[styles.marker, { backgroundColor: "#F39C12" }]}>
              <Text style={styles.markerText}>Anc</Text>
              <Text style={[styles.markerText, { fontSize: 8 }]}>{anchor}</Text>
            </View>
            {/* Dot showing where the anchor point should be */}
            <View
              style={[
                styles.anchorDot,
                {
                  left: 46, // center horizontally (100/2 - 4)
                  top:
                    (anchor === "top" ? 0 : anchor === "bottom" ? 1 : 0.5) *
                      100 -
                    4,
                },
              ]}
            />
          </View>
        </MarkerView>

        {/* Touch interaction test markers (#557, #1018) */}
        <MarkerView lngLat={MARKER_COORDS[5]!}>
          <View style={{ alignItems: "center", gap: 4 }}>
            {/* TouchableOpacity test */}
            <TouchableOpacity
              style={[
                styles.marker,
                { backgroundColor: "#2ECC71", height: 40 },
              ]}
              onPress={() => {
                console.log("TouchableOpacity onPress fired!");
                setTouchableCount((c) => c + 1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.markerText}>Touch</Text>
              <Text style={[styles.markerText, { fontSize: 8 }]}>
                {touchableCount}
              </Text>
            </TouchableOpacity>

            {/* Pressable test with both onPress and onPressIn */}
            <Pressable
              style={({ pressed }) => [
                styles.marker,
                {
                  backgroundColor: pressed ? "#1ABC9C" : "#3498DB",
                  height: 40,
                },
              ]}
              onPress={() => {
                console.log("Pressable onPress fired!");
                setPressableCount((c) => c + 1);
              }}
              onPressIn={() => {
                console.log("Pressable onPressIn fired!");
                setPressInCount((c) => c + 1);
              }}
            >
              <Text style={styles.markerText}>Press</Text>
              <Text style={[styles.markerText, { fontSize: 8 }]}>
                {pressableCount}/{pressInCount}
              </Text>
            </Pressable>
          </View>
        </MarkerView>
      </MapView>

      <Bubble>
        <View style={styles.controls}>
          <Text style={{ fontWeight: "bold" }}>MarkerView Tests</Text>

          {/* zIndex control (#998) */}
          <TouchableOpacity style={styles.button} onPress={rotateZIndex}>
            <Text style={styles.buttonText}>Rotate zIndex (#998)</Text>
          </TouchableOpacity>
          <Text style={styles.statusText}>
            zIndex: Red={zIndices[0]} Teal={zIndices[1]} Blue={zIndices[2]}
          </Text>

          {/* Anchor control (#1158) */}
          <TouchableOpacity style={styles.button} onPress={cycleAnchor}>
            <Text style={styles.buttonText}>Cycle Anchor (#1158)</Text>
          </TouchableOpacity>
          <Text style={styles.statusText}>Anchor: {anchor}</Text>

          {/* Touch test status (#557, #1018) */}
          <Text style={[styles.statusText, { fontWeight: "bold" }]}>
            Touch Tests (tap markers on right):
          </Text>
          <Text style={styles.statusText}>
            TouchableOpacity: {touchableCount} taps (#557)
          </Text>
          <Text style={styles.statusText}>
            Pressable onPress/onPressIn: {pressableCount}/{pressInCount} (#1018)
          </Text>
        </View>
      </Bubble>
    </>
  );
}

export { MarkerViewExample as MarkerView };
