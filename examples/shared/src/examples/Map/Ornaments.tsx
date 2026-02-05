import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const CORNERS = ["TL", "TR", "BR", "BL"] as const;

function buildPosition(cornerIndex: number, margin: number) {
  switch (cornerIndex) {
    case 0:
      return { top: margin, left: margin };
    case 1:
      return { top: margin, right: margin };
    case 2:
      return { bottom: margin, right: margin };
    case 3:
      return { bottom: margin, left: margin };
    default:
      return { top: margin, left: margin };
  }
}

function OrnamentRow({
  name,
  cornerIndex,
  margin,
  onCornerChange,
  onMarginChange,
}: {
  name: string;
  cornerIndex: number;
  margin: number;
  onCornerChange: () => void;
  onMarginChange: (delta: number) => void;
}) {
  return (
    <View style={styles.controls}>
      <Text style={styles.label}>{name}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.chip} onPress={onCornerChange}>
          <Text style={styles.chipText}>{CORNERS[cornerIndex]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => onMarginChange(-8)}
        >
          <Text style={styles.chipText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.marginLabel}>{margin}</Text>
        <TouchableOpacity style={styles.chip} onPress={() => onMarginChange(8)}>
          <Text style={styles.chipText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function Ornaments() {
  const [compassCorner, setCompassCorner] = useState(0);
  const [compassMargin, setCompassMargin] = useState(8);

  const [attrCorner, setAttrCorner] = useState(3);
  const [attrMargin, setAttrMargin] = useState(8);

  const [logoCorner, setLogoCorner] = useState(2);
  const [logoMargin, setLogoMargin] = useState(8);

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        compass
        compassPosition={buildPosition(compassCorner, compassMargin)}
        compassHiddenFacingNorth={false}
        attributionPosition={buildPosition(attrCorner, attrMargin)}
        logoPosition={buildPosition(logoCorner, logoMargin)}
      />
      <OrnamentRow
        name="Compass"
        cornerIndex={compassCorner}
        margin={compassMargin}
        onCornerChange={() => setCompassCorner((i) => (i + 1) % CORNERS.length)}
        onMarginChange={(d) => setCompassMargin((m) => Math.max(0, m + d))}
      />
      <OrnamentRow
        name="Attribution"
        cornerIndex={attrCorner}
        margin={attrMargin}
        onCornerChange={() => setAttrCorner((i) => (i + 1) % CORNERS.length)}
        onMarginChange={(d) => setAttrMargin((m) => Math.max(0, m + d))}
      />
      <OrnamentRow
        name="Logo"
        cornerIndex={logoCorner}
        margin={logoMargin}
        onCornerChange={() => setLogoCorner((i) => (i + 1) % CORNERS.length)}
        onMarginChange={(d) => setLogoMargin((m) => Math.max(0, m + d))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#cccccc",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    width: 80,
  },
  marginLabel: {
    fontSize: 13,
    fontWeight: "600",
    width: 24,
    textAlign: "center",
  },
  chip: {
    backgroundColor: "#4264fb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  chipText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
});
