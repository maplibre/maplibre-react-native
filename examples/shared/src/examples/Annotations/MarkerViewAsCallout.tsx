import {
  type LngLat,
  Map,
  MarkerView,
  GeoJSONSource,
  Layer,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import maplibreIcon from "@/assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function MarkerViewAsCallout() {
  const [selectedFeature, setSelectedFeature] =
    useState<GeoJSON.Feature<GeoJSON.Point, { name: string }>>();

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <GeoJSONSource
        data={FEATURE_COLLECTION}
        onPress={(event) => {
          const feature = event.nativeEvent.features[0] as
            | GeoJSON.Feature<GeoJSON.Point, { name: string }>
            | undefined;

          setSelectedFeature(feature);
        }}
      >
        <Layer
          type="symbol"
          id="symbol-layer"
          style={{
            iconAllowOverlap: true,
            iconAnchor: "center",
            iconImage: maplibreIcon,
            iconSize: 1,
          }}
        />
      </GeoJSONSource>

      {selectedFeature && (
        <MarkerView
          lngLat={selectedFeature.geometry.coordinates as LngLat}
          anchor="center"
          offset={[0, -48]}
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
    </Map>
  );
}
