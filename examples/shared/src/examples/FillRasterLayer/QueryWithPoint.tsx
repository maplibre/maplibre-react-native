import {
  Camera,
  FillLayer,
  MapView,
  type MapViewRef,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { Feature, FeatureCollection } from "geojson";
import { useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "../../assets/geojson/new-york-city-districts.json";
import { Bubble } from "../../components/Bubble";

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
  const mapRef = useRef<MapViewRef>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();

  return (
    <>
      <MapView
        ref={mapRef}
        onPress={async (event) => {
          if (!mapRef.current) return;

          const { longitude, latitude } = event.nativeEvent;

          const featureCollection = await mapRef.current.queryRenderedFeatures(
            {
              longitude,
              latitude,
            },
            { layers: ["nycFill"] },
          );

          setSelectedFeature(featureCollection.features[0]);
        }}
      >
        <Camera zoom={9} longitude={-73.970895} latitude={40.723279} />

        <ShapeSource
          id="nyc"
          shape={newYorkCityDistrictsFeatureCollection as FeatureCollection}
        >
          <FillLayer id="nycFill" style={styles.neighborhoods} />
        </ShapeSource>

        {selectedFeature ? (
          <ShapeSource id="selectedNYC" shape={selectedFeature}>
            <FillLayer
              id="selectedNYCFill"
              style={styles.selectedNeighborhood}
            />
          </ShapeSource>
        ) : null}
      </MapView>

      <Bubble>
        <Text>Press on a feature to highlight it.</Text>
      </Bubble>
    </>
  );
}
