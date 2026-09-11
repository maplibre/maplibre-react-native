import {
  Camera,
  type GeoJSONSourceRef,
  Layer,
  Map,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GeoJSONSourceFeatureState() {
  const sourceRef = useRef<GeoJSONSourceRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera zoom={9} center={[-73.970895, 40.723279]} />

        <GeoJSONSource
          ref={sourceRef}
          id="nyc"
          data={newYorkCityDistrictsFeatureCollection as FeatureCollection}
          // Districts share borders, so a 44x44 hitbox would return several
          // neighbours and the first one is not necessarily under the finger.
          hitbox={{ top: 1, right: 1, bottom: 1, left: 1 }}
          onPress={async (event) => {
            const feature = event.nativeEvent.features[0];
            if (!sourceRef.current || feature?.id === undefined) return;

            const state = await sourceRef.current.getFeatureState({
              featureId: feature.id,
            });
            const selected = state?.selected === true;

            await sourceRef.current.setFeatureState(
              { featureId: feature.id },
              { selected: !selected },
            );
            setSelectedCount((count) => count + (selected ? -1 : 1));
          }}
        >
          <Layer
            type="fill"
            id="nycFill"
            paint={{
              "fill-antialias": true,
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "red",
                "blue",
              ],
              "fill-outline-color": "black",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.9,
                0.5,
              ],
            }}
          />
        </GeoJSONSource>
      </Map>

      <Bubble
        onPress={async () => {
          await sourceRef.current?.removeFeatureState();
          setSelectedCount(0);
        }}
      >
        <Text>
          Press a district to toggle its selection. Selected: {selectedCount}
        </Text>
        <Text>Press here to reset all feature state.</Text>
      </Bubble>
    </>
  );
}
