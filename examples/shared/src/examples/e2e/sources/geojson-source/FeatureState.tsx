import {
  type FeatureState,
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
import { waitForFeatureState } from "@/utils/waitForFeatureState";

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

const NESTED_STATE = {
  level1: {
    level2: {
      level3: "deep",
      count: 3,
      list: [1, "two", { flag: true }],
    },
  },
};

const EXPECTED = {
  initial: null,
  afterSet: { selected: true, score: 1 },
  afterMerge: { selected: true, score: 1, hovered: true },
  afterNested: {
    selected: true,
    score: 1,
    hovered: true,
    nested: NESTED_STATE,
  },
  viaStringId: {
    selected: true,
    score: 1,
    hovered: true,
    nested: NESTED_STATE,
  },
  afterRemoveKey: { selected: true, score: 1, nested: NESTED_STATE },
  afterRemoveNested: { selected: true, score: 1 },
  afterRemoveFeature: null,
  feature1AfterReset: null,
  feature2AfterReset: null,
} satisfies Record<string, FeatureState | null>;

export function FeatureStateExample() {
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

              const get = async (id: string | number) =>
                source.getFeatureState({ id });

              const initial = await get(1);

              await source.setFeatureState(
                { id: 1 },
                { selected: true, score: 1 },
              );
              const afterSet = await get(1);

              await source.setFeatureState({ id: 1 }, { hovered: true });
              const afterMerge = await get(1);

              await source.setFeatureState({ id: 1 }, { nested: NESTED_STATE });
              const afterNested = await get(1);

              // Same feature addressed by string id
              const viaStringId = await get("1");

              await source.removeFeatureState({ id: 1 }, "hovered");
              const afterRemoveKey = await waitForFeatureState(
                () => get(1),
                EXPECTED.afterRemoveKey,
              );

              await source.removeFeatureState({ id: 1 }, "nested");
              const afterRemoveNested = await waitForFeatureState(
                () => get(1),
                EXPECTED.afterRemoveNested,
              );

              await source.removeFeatureState({ id: 1 });
              const afterRemoveFeature = await waitForFeatureState(
                () => get(1),
                EXPECTED.afterRemoveFeature,
              );

              await source.setFeatureState({ id: 1 }, { score: 1 });
              await source.setFeatureState({ id: 2 }, { selected: true });
              await source.removeFeatureState();
              const feature1AfterReset = await waitForFeatureState(
                () => get(1),
                EXPECTED.feature1AfterReset,
              );
              const feature2AfterReset = await waitForFeatureState(
                () => get(2),
                EXPECTED.feature2AfterReset,
              );

              setResults({
                initial,
                afterSet,
                afterMerge,
                afterNested,
                viaStringId,
                afterRemoveKey,
                afterRemoveFeature,
                afterRemoveNested,
                feature1AfterReset,
                feature2AfterReset,
              });
            } catch (error) {
              setResults({ error: String(error) });
            }
          }}
        />

        <AssertEquals expect={EXPECTED} actual={results} />
      </Bubble>
    </>
  );
}
