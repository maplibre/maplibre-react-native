import {
  Layer,
  Map,
  VectorSource,
  type VectorSourceRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";

import { AssertEquals } from "@/components/AssertEquals";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const SOURCE_LAYER = "countries";

/** Removals are applied on the next rendered frame */
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 300));

export function FeatureState() {
  const vectorSourceRef = useRef<VectorSourceRef>(null);
  const [results, setResults] = useState<Record<string, unknown>>();

  return (
    <>
      <Map testID="map" mapStyle={MAPLIBRE_DEMO_STYLE}>
        <VectorSource
          ref={vectorSourceRef}
          id="maplibre-tiles"
          url="https://demotiles.maplibre.org/tiles/tiles.json"
        >
          <Layer
            type="fill"
            id="test-layer"
            source-layer={SOURCE_LAYER}
            paint={{
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                colors.blue,
                colors.grey,
              ],
            }}
          />
        </VectorSource>
      </Map>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            try {
              const source = vectorSourceRef.current;
              if (!source) return;

              const get = async (featureId: string | number) =>
                source.getFeatureState({
                  sourceLayer: SOURCE_LAYER,
                  featureId,
                });

              const initial = await get(4);

              await source.setFeatureState(
                { sourceLayer: SOURCE_LAYER, featureId: 4 },
                { selected: true, score: 1 },
              );
              const afterSet = await get(4);

              await source.setFeatureState(
                { sourceLayer: SOURCE_LAYER, featureId: 4 },
                { hovered: true },
              );
              const afterMerge = await get(4);

              // Same feature addressed by string id
              const viaStringId = await get("4");

              await source.removeFeatureState({
                sourceLayer: SOURCE_LAYER,
                featureId: 4,
                key: "hovered",
              });
              await nextFrame();
              const afterRemoveKey = await get(4);

              await source.removeFeatureState({
                sourceLayer: SOURCE_LAYER,
                featureId: 4,
              });
              await nextFrame();
              const afterRemoveFeature = await get(4);

              await source.setFeatureState(
                { sourceLayer: SOURCE_LAYER, featureId: 4 },
                { score: 1 },
              );
              await source.setFeatureState(
                { sourceLayer: SOURCE_LAYER, featureId: 22 },
                { selected: true },
              );
              await source.removeFeatureState({ sourceLayer: SOURCE_LAYER });
              await nextFrame();
              const feature4AfterReset = await get(4);
              const feature22AfterReset = await get(22);

              setResults({
                initial,
                afterSet,
                afterMerge,
                viaStringId,
                afterRemoveKey,
                afterRemoveFeature,
                feature4AfterReset,
                feature22AfterReset,
              });
            } catch (error) {
              setResults({ error: String(error) });
            }
          }}
        />

        <AssertEquals
          expect={{
            initial: null,
            afterSet: { selected: true, score: 1 },
            afterMerge: { selected: true, score: 1, hovered: true },
            viaStringId: { selected: true, score: 1, hovered: true },
            afterRemoveKey: { selected: true, score: 1 },
            afterRemoveFeature: null,
            feature4AfterReset: null,
            feature22AfterReset: null,
          }}
          actual={results}
        />
      </Bubble>
    </>
  );
}
