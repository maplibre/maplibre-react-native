import {
  type LngLat,
  Map,
  Marker,
  GeoJSONSource,
  Layer,
  Images,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import maplibreIcon from "@/assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function MarkerAsCallout() {
  const [selectedFeature, setSelectedFeature] =
    useState<GeoJSON.Feature<GeoJSON.Point, { name: string }>>();

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Images images={{ "maplibre-icon": maplibreIcon }} />

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
          layout={{
            "icon-allow-overlap": true,
            "icon-anchor": "center",
            "icon-image": "maplibre-icon",
            "icon-size": 1,
          }}
        />
      </GeoJSONSource>

      {selectedFeature && (
        <Marker
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
        </Marker>
      )}
    </Map>
  );
}
