import {
  FillLayer,
  MapView,
  VectorSource,
} from "@maplibre/maplibre-react-native";
import type { VectorSourceRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";

export function CustomVectorSource() {
  const vectorSourceRef = useRef<VectorSourceRef>(null);
  const [featuresCount, setFeaturesCount] = useState<number>();

  return (
    <>
      <MapView>
        <VectorSource
          id="maplibre-tiles"
          url="https://demotiles.maplibre.org/tiles/tiles.json"
          ref={vectorSourceRef}
          onPress={(event) => {
            event.persist();

            console.log(
              `VectorSource onPress: ${event.nativeEvent.features}`,
              event.nativeEvent.features,
            );
          }}
        >
          <FillLayer
            id="countries"
            source-layer="countries"
            style={{
              fillColor: "#ffffff",
              fillAntialias: true,
            }}
          />
        </VectorSource>
      </MapView>
      <Bubble
        onPress={async () => {
          const features = await vectorSourceRef.current?.querySourceFeatures({
            sourceLayer: "countries",
          });

          setFeaturesCount(features?.length);
        }}
      >
        <Text>Query features</Text>
        {typeof featuresCount === "number" ? (
          <Text>Count: {featuresCount}</Text>
        ) : null}
      </Bubble>
    </>
  );
}
