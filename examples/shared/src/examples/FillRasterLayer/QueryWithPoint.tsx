import {
  Camera,
  FillLayer,
  MapView,
  type MapViewRef,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import type { Feature, FeatureCollection } from "geojson";
import { useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";

const styles = {
  neighborhoods: {
    fillAntialias: true,
    fillColor: "blue",
    fillOutlineColor: "black",
    fillOpacity: 0.84,
  },
  selectedNeighborhood: {
    fillAntialias: true,
    fillColor: "green",
    fillOpacity: 0.84,
  },
};

export function QueryWithPoint() {
  const mapViewRef = useRef<MapViewRef>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();

  return (
    <>
      <MapView
        ref={mapViewRef}
        onPress={async (event) => {
          if (!mapViewRef.current) return;

          const features = await mapViewRef.current.queryRenderedFeatures(
            event.nativeEvent.point,
            { layers: ["nycFill"] },
          );

          setSelectedFeature(features[0]);
        }}
      >
        <Camera zoom={9} center={[-73.970895, 40.723279]} />

        <GeoJSONSource
          id="nyc"
          data={newYorkCityDistrictsFeatureCollection as FeatureCollection}
        >
          <FillLayer id="nycFill" style={styles.neighborhoods} />
        </GeoJSONSource>

        {selectedFeature ? (
          <GeoJSONSource id="selectedNYC" data={selectedFeature}>
            <FillLayer
              id="selectedNYCFill"
              style={styles.selectedNeighborhood}
            />
          </GeoJSONSource>
        ) : null}
      </MapView>

      <Bubble>
        <Text>Press on a feature to highlight it.</Text>
      </Bubble>
    </>
  );
}
