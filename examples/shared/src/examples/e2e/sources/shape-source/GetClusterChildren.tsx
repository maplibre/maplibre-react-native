import {
  CircleLayer,
  MapView,
  ShapeSource,
  type ShapeSourceRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "../../../../components/AssertZod";
import { Bubble } from "../../../../components/Bubble";
import { colors } from "../../../../styles/colors";

const CLUSTER_FEATURES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Point 1" },
      geometry: { type: "Point", coordinates: [0, 0] },
    },
    {
      type: "Feature",
      properties: { name: "Point 2" },
      geometry: { type: "Point", coordinates: [0.0001, 0.0001] },
    },
    {
      type: "Feature",
      properties: { name: "Point 3" },
      geometry: { type: "Point", coordinates: [0.0002, 0.0002] },
    },
    {
      type: "Feature",
      properties: { name: "Point 4" },
      geometry: { type: "Point", coordinates: [0.0003, 0.0003] },
    },
  ],
};

export function GetClusterChildren() {
  const shapeSourceRef = useRef<ShapeSourceRef>(null);
  const [clusterId, setClusterId] = useState<number>();
  const [children, setChildren] = useState<GeoJSON.Feature[]>();

  return (
    <>
      <MapView testID="map-view">
        <ShapeSource
          ref={shapeSourceRef}
          id="test-source"
          data={CLUSTER_FEATURES}
          cluster
          clusterRadius={50}
          clusterMaxZoom={14}
          hitbox={{ top: 64, right: 64, bottom: 64, left: 64 }}
          onPress={(event) => {
            const feature = event.nativeEvent.features[0];
            if (feature?.properties?.cluster) {
              setClusterId(feature.properties.cluster_id);
            }
          }}
        >
          <CircleLayer
            id="clusters"
            filter={["has", "point_count"]}
            style={{
              circleRadius: 20,
              circleColor: colors.blue,
            }}
          />
          <CircleLayer
            id="points"
            filter={["!", ["has", "point_count"]]}
            style={{
              circleRadius: 8,
              circleColor: colors.grey,
            }}
          />
        </ShapeSource>
      </MapView>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            if (clusterId !== undefined) {
              const result =
                await shapeSourceRef.current?.getClusterChildren(clusterId);
              setChildren(result);
            }
          }}
        />

        <AssertZod
          schema={z.array(
            z.object({
              type: z.literal("Feature"),
              properties: z.any(),
              geometry: z.any(),
            }),
          )}
          actual={children}
        />
      </Bubble>
    </>
  );
}
