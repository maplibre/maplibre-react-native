import {
  type Anchor,
  Camera,
  type CameraRef,
  Map,
  PointAnnotation,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const SIZE = 80;
const INITIAL_ZOOM = 16;

// Anchor position lookup for dot visualization
const ANCHOR_POSITIONS: Record<Anchor, { x: number; y: number }> = {
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
  "bottom-left": { x: 0, y: 1 },
  "bottom-right": { x: 1, y: 1 },
  center: { x: 0.5, y: 0.5 },
  bottom: { x: 0.5, y: 1 },
  top: { x: 0.5, y: 0 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
};

// Non-overlapping grid of anchor test cases
const ANCHOR_TESTS: { anchor: Anchor; label: string; desc: string }[] = [
  { anchor: "top-left", label: "Top-Left", desc: "Red dot at top-left" },
  { anchor: "top-right", label: "Top-Right", desc: "Red dot at top-right" },
  {
    anchor: "bottom-left",
    label: "Bottom-Left",
    desc: "Red dot at bottom-left",
  },
  {
    anchor: "bottom-right",
    label: "Bottom-Right",
    desc: "Red dot at bottom-right",
  },
  { anchor: "center", label: "Center", desc: "Red dot at center" },
  {
    anchor: "bottom",
    label: "Bottom-Center",
    desc: "Red dot at bottom-center (default pin behavior)",
  },
];

// Spread markers out so they don't overlap
const BASE_LNG = -73.98;
const BASE_LAT = 40.753;
const GRID_POSITIONS: [number, number][] = [
  [0, 1], // Top-Left anchor -> top-left position
  [2, 1], // Top-Right anchor -> top-right position
  [0, -1], // Bottom-Left anchor -> bottom-left position
  [2, -1], // Bottom-Right anchor -> bottom-right position
  [1, 0], // Center anchor -> center position
  [1, -2], // Bottom-Center anchor -> bottom position
];

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 4,
  },
  anchorDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "white",
  },
  label: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  labelText: {
    color: "white",
    fontSize: 9,
    textAlign: "center",
    fontWeight: "600",
  },
  zoomControls: {
    position: "absolute",
    right: 16,
    top: 16,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export function PointAnnotationAnchors() {
  const cameraRef = useRef<CameraRef>(null);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(1, Math.min(20, zoom + delta));
    setZoom(newZoom);
    cameraRef.current?.zoomTo(newZoom, { duration: 300 });
  };

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [BASE_LNG + 0.001, BASE_LAT - 0.0005],
            zoom: INITIAL_ZOOM,
          }}
        />

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => handleZoom(1)}
          >
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => handleZoom(-1)}
          >
            <Text style={styles.zoomButtonText}>−</Text>
          </TouchableOpacity>
        </View>

        {ANCHOR_TESTS.map((test, i) => {
          const position = GRID_POSITIONS[i]!;
          const lngLat: [number, number] = [
            BASE_LNG + position[0] * 0.001,
            BASE_LAT + position[1] * 0.0008,
          ];

          // Position the red dot based on anchor values
          // anchor (0,0) = top-left, so dot at top-left of container
          // anchor (1,1) = bottom-right, so dot at bottom-right
          const pos = ANCHOR_POSITIONS[test.anchor];
          const dotStyle = {
            left: pos.x * (SIZE - 12),
            top: pos.y * (SIZE - 12),
          };

          return (
            <PointAnnotation
              key={test.label}
              id={test.label}
              lngLat={lngLat}
              anchor={test.anchor}
            >
              <View style={styles.container}>
                {/* Red dot shows where the anchor point is */}
                <View style={[styles.anchorDot, dotStyle]} />
                {/* Label */}
                <View style={styles.label}>
                  <Text style={styles.labelText}>{test.label}</Text>
                </View>
              </View>
            </PointAnnotation>
          );
        })}
      </Map>
    </>
  );
}
