import {
  type Anchor,
  GeoJSONSource,
  Layer,
  type LngLat,
  Map,
  Marker,
  type PixelPoint,
  ViewAnnotation,
} from "@maplibre/maplibre-react-native";
import { StyleSheet, Text, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const SIZE = 80;

const ANCHOR_POSITIONS: Record<Anchor, { x: number; y: number }> = {
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
  "bottom-right": { x: 1, y: 1 },
  "bottom-left": { x: 0, y: 1 },
  center: { x: 0.5, y: 0.5 },
  bottom: { x: 0.5, y: 1 },
  top: { x: 0.5, y: 0 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
};

const ANCHOR_EXAMPLES: {
  anchor: Anchor;
  lngLat: LngLat;
  offset?: PixelPoint;
}[] = [
  {
    anchor: "top-left",
    lngLat: [-122.4194, 37.7749],
  },
  {
    anchor: "top-right",
    lngLat: [139.6917, 35.6895],
    offset: [-16, 8],
  },
  {
    anchor: "bottom-left",
    lngLat: [-43.1729, -22.9068],
    offset: [16, -8],
  },
  {
    anchor: "bottom-right",
    lngLat: [151.2093, -33.8688],
  },
  {
    anchor: "center",
    lngLat: [2.3522, 48.8566],
    offset: [40, 0],
  },
  {
    anchor: "bottom",
    lngLat: [-0.1276, 51.5074],
    offset: [0, -16],
  },
];

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(222, 222, 222, 0.3)",
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
  },
  anchor: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: "#ffffff",
    zIndex: 1,
  },
  label: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  labelText: {
    color: "white",
    fontSize: 8,
    textAlign: "center",
    fontWeight: "600",
  },
});

interface AbstractAnchorsProps {
  AnnotationComponent: typeof Marker | typeof ViewAnnotation;
}

export function AbstractAnchors({ AnnotationComponent }: AbstractAnchorsProps) {
  const referencePointsGeoJSON: GeoJSON.GeometryCollection = {
    type: "GeometryCollection",
    geometries: ANCHOR_EXAMPLES.map((test) => {
      return {
        type: "Point",
        coordinates: test.lngLat,
      };
    }),
  };

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        {/* GeoJSON circles at actual lngLat coordinates - these are the TRUE reference points */}
        <GeoJSONSource id="reference-points" data={referencePointsGeoJSON}>
          <Layer
            type="circle"
            id="reference-circles"
            beforeId="org.maplibre.annotations.points"
            paint={{
              "circle-radius": 8,
              "circle-color": colors.blue,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            }}
          />
        </GeoJSONSource>

        {ANCHOR_EXAMPLES.map((test, index) => {
          // Position the red dot based on anchor values
          const pos = ANCHOR_POSITIONS[test.anchor];
          const dotStyle = {
            left: pos.x * (SIZE - 12),
            top: pos.y * (SIZE - 12),
          };

          return (
            <AnnotationComponent
              key={index}
              lngLat={test.lngLat}
              anchor={test.anchor}
              offset={test.offset}
            >
              <View style={styles.container}>
                <View style={styles.label}>
                  <Text style={styles.labelText}>
                    {test.anchor}
                    {test.offset
                      ? `\n${test.offset![0]}, ${test.offset![1]}`
                      : ""}
                  </Text>
                </View>
                <View style={[styles.anchor, dotStyle]} />
              </View>
            </AnnotationComponent>
          );
        })}
      </Map>
    </>
  );
}
