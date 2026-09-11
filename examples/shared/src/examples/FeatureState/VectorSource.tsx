import {
  Camera,
  Layer,
  Map,
  VectorSource,
  type VectorSourceRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const SOURCE_LAYER = "countries";

export function VectorSourceFeatureState() {
  const sourceRef = useRef<VectorSourceRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera zoom={2} center={[10, 50]} />

        <VectorSource
          ref={sourceRef}
          id="maplibre-tiles"
          url="https://demotiles.maplibre.org/tiles/tiles.json"
          // Countries share borders, so a 44x44 hitbox would return several
          // neighbours and the first one is not necessarily under the finger.
          hitbox={{ top: 1, right: 1, bottom: 1, left: 1 }}
          onPress={async (event) => {
            const feature = event.nativeEvent.features[0];
            if (!sourceRef.current || feature?.id === undefined) return;

            const state = await sourceRef.current.getFeatureState({
              sourceLayer: SOURCE_LAYER,
              featureId: feature.id,
            });
            const selected = state?.selected === true;

            await sourceRef.current.setFeatureState(
              { sourceLayer: SOURCE_LAYER, featureId: feature.id },
              { selected: !selected },
            );
            setSelectedCount((count) => count + (selected ? -1 : 1));
          }}
        >
          <Layer
            type="fill"
            id="countries-selection"
            source-layer={SOURCE_LAYER}
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
                0.3,
              ],
            }}
          />
        </VectorSource>
      </Map>

      <Bubble
        onPress={async () => {
          await sourceRef.current?.removeFeatureState({
            sourceLayer: SOURCE_LAYER,
          });
          setSelectedCount(0);
        }}
      >
        <Text>
          Press a country to toggle its selection. Selected: {selectedCount}
        </Text>
        <Text>Press here to reset all feature state.</Text>
      </Bubble>
    </>
  );
}
