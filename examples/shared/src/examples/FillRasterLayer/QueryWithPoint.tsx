import {
  Camera,
  Layer,
  Map,
  type MapRef,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import type { Feature, FeatureCollection } from "geojson";
import { useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function QueryWithPoint() {
  const mapRef = useRef<MapRef>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();

  return (
    <>
      <Map
        ref={mapRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          if (!mapRef.current) return;

          const features = await mapRef.current.queryRenderedFeatures(
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
          <Layer
            type="fill"
            id="nycFill"
            paint={{
              "fill-antialias": true,
              "fill-color": "blue",
              "fill-outline-color": "black",
              "fill-opacity": 0.84,
            }}
          />
        </GeoJSONSource>

        {selectedFeature ? (
          <GeoJSONSource id="selectedNYC" data={selectedFeature}>
            <Layer
              type="fill"
              id="selectedNYCFill"
              paint={{
                "fill-antialias": true,
                "fill-color": "green",
                "fill-opacity": 0.84,
              }}
            />
          </GeoJSONSource>
        ) : null}
      </Map>

      <Bubble>
        <Text>Press on a feature to highlight it.</Text>
      </Bubble>
    </>
  );
}
