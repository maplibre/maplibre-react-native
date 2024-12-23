import {
  MapView,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

export function CustomCallout() {
  const [selectedFeature, setSelectedFeature] =
    useState<GeoJSON.Feature<GeoJSON.Point, { name: string }>>();

  return (
    <MapView style={sheet.matchParent}>
      <ShapeSource
        id="shape-source"
        shape={FEATURE_COLLECTION}
        onPress={(event) => {
          const feature = event?.features[0] as
            | GeoJSON.Feature<GeoJSON.Point, { name: string }>
            | undefined;

          setSelectedFeature(feature);
        }}
      >
        <SymbolLayer
          id="symbol-layer"
          style={{
            iconAllowOverlap: true,
            iconAnchor: "center",
            iconImage: maplibreIcon,
            iconSize: 1,
          }}
        />
      </ShapeSource>
      {selectedFeature && (
        <MarkerView
          id="select-feature-marker"
          coordinate={selectedFeature.geometry.coordinates}
          anchor={{ x: 0.5, y: -1.1 }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
            }}
          >
            <Text>{selectedFeature?.properties?.name}</Text>
          </View>
        </MarkerView>
      )}
    </MapView>
  );
}
