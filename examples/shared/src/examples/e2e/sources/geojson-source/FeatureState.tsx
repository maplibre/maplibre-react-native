import {
  GeoJSONSource,
  type GeoJSONSourceRef,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";

import { AssertEquals } from "@/components/AssertEquals";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const FEATURES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      properties: {},
      geometry: { type: "Point", coordinates: [0, 0] },
    },
    {
      type: "Feature",
      id: 2,
      properties: {},
      geometry: { type: "Point", coordinates: [12, 12] },
    },
  ],
};

/** Removals are applied on the next rendered frame */
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 300));

export function FeatureState() {
  const geoJSONSourceRef = useRef<GeoJSONSourceRef>(null);
  const [results, setResults] = useState<Record<string, unknown>>();

  return (
    <>
      <Map testID="map" mapStyle={MAPLIBRE_DEMO_STYLE}>
        <GeoJSONSource ref={geoJSONSourceRef} data={FEATURES}>
          <Layer
            type="circle"
            id="test-layer"
            paint={{
              "circle-radius": 50,
              "circle-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                colors.blue,
                colors.grey,
              ],
            }}
          />
        </GeoJSONSource>
      </Map>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            try {
              const source = geoJSONSourceRef.current;
              if (!source) return;

              const get = async (featureId: string | number) =>
                source.getFeatureState({ featureId });

              const initial = await get(1);

              await source.setFeatureState(
                { featureId: 1 },
                { selected: true, score: 1 },
              );
              const afterSet = await get(1);

              await source.setFeatureState({ featureId: 1 }, { hovered: true });
              const afterMerge = await get(1);

              // Same feature addressed by string id
              const viaStringId = await get("1");

              await source.removeFeatureState({ featureId: 1, key: "hovered" });
              await nextFrame();
              const afterRemoveKey = await get(1);

              await source.removeFeatureState({ featureId: 1 });
              await nextFrame();
              const afterRemoveFeature = await get(1);

              await source.setFeatureState({ featureId: 1 }, { score: 1 });
              await source.setFeatureState(
                { featureId: 2 },
                { selected: true },
              );
              await source.removeFeatureState();
              await nextFrame();
              const feature1AfterReset = await get(1);
              const feature2AfterReset = await get(2);

              setResults({
                initial,
                afterSet,
                afterMerge,
                viaStringId,
                afterRemoveKey,
                afterRemoveFeature,
                feature1AfterReset,
                feature2AfterReset,
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
            feature1AfterReset: null,
            feature2AfterReset: null,
          }}
          actual={results}
        />
      </Bubble>
    </>
  );
}
