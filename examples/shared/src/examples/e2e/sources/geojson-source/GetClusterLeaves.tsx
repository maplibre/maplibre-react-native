import {
  Layer,
  Map,
  GeoJSONSource,
  type GeoJSONSourceRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const CLUSTER_FEATURES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Point 1", value: 10 },
      geometry: { type: "Point", coordinates: [0, 0] },
    },
    {
      type: "Feature",
      properties: { name: "Point 2", value: 20 },
      geometry: { type: "Point", coordinates: [0.0001, 0.0001] },
    },
    {
      type: "Feature",
      properties: { name: "Point 3", value: 30 },
      geometry: { type: "Point", coordinates: [0.0002, 0.0002] },
    },
    {
      type: "Feature",
      properties: { name: "Point 4", value: 40 },
      geometry: { type: "Point", coordinates: [0.0003, 0.0003] },
    },
    {
      type: "Feature",
      properties: { name: "Point 5", value: 50 },
      geometry: { type: "Point", coordinates: [0.0004, 0.0004] },
    },
  ],
};

export function GetClusterLeaves() {
  const geoJSONSourceRef = useRef<GeoJSONSourceRef>(null);
  const [result, setResult] = useState<GeoJSON.Feature[]>();

  return (
    <>
      <Map testID="map-view" mapStyle={MAPLIBRE_DEMO_STYLE}>
        <GeoJSONSource
          ref={geoJSONSourceRef}
          data={CLUSTER_FEATURES}
          cluster
          clusterRadius={50}
          clusterMaxZoom={14}
        >
          <Layer
            type="circle"
            id="clusters"
            filter={["has", "point_count"]}
            style={{
              circleRadius: 80,
              circleColor: colors.blue,
            }}
          />
          <Layer
            type="circle"
            id="points"
            filter={["!", ["has", "point_count"]]}
            style={{
              circleRadius: 8,
              circleColor: colors.grey,
            }}
          />
        </GeoJSONSource>
      </Map>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            const featureCollection = await geoJSONSourceRef.current?.getData();
            const clusterId =
              featureCollection?.features[0]?.properties?.cluster_id;

            if (clusterId !== undefined) {
              const result = await geoJSONSourceRef.current?.getClusterLeaves(
                clusterId,
                10,
                0,
              );
              setResult(result);
            }
          }}
        />

        <AssertZod
          schema={z.array(
            z.object({
              type: z.literal("Feature"),
              properties: z.object({
                name: z.string(),
                value: z.number(),
              }),
              geometry: z.any(),
            }),
          )}
          actual={
            result as GeoJSON.Feature<
              GeoJSON.Point,
              { name: string; value: number }
            >[]
          }
        />
      </Bubble>
    </>
  );
}
