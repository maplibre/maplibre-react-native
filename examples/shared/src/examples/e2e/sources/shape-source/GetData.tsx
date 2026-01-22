import {
  CircleLayer,
  MapView,
  ShapeSource,
  type ShapeSourceRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { colors } from "@/styles/colors";

const FEATURES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { type: "restaurant", name: "Restaurant A" },
      geometry: { type: "Point", coordinates: [0, 0] },
    },
    {
      type: "Feature",
      properties: { type: "shop", name: "Shop B" },
      geometry: { type: "Point", coordinates: [8, 8] },
    },
    {
      type: "Feature",
      properties: { type: "restaurant", name: "Restaurant C" },
      geometry: { type: "Point", coordinates: [-8, -8] },
    },
  ],
};

export function GetData() {
  const shapeSourceRef = useRef<ShapeSourceRef>(null);
  const [allFeatures, setAllFeatures] = useState<GeoJSON.FeatureCollection>();
  const [filteredFeatures, setFilteredFeatures] =
    useState<GeoJSON.FeatureCollection>();

  return (
    <>
      <MapView testID="map-view">
        <ShapeSource ref={shapeSourceRef} id="test-source" data={FEATURES}>
          <CircleLayer
            id="test-layer"
            style={{
              circleRadius: 8,
              circleColor: colors.blue,
            }}
          />
        </ShapeSource>
      </MapView>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setAllFeatures(await shapeSourceRef.current?.getData());

            setFilteredFeatures(
              await shapeSourceRef.current?.getData([
                "==",
                ["get", "type"],
                "restaurant",
              ]),
            );
          }}
        />

        <AssertZod
          schema={z.object({
            type: z.literal("FeatureCollection"),
            features: z.array(z.any()).length(3),
          })}
          actual={allFeatures}
        />

        <AssertZod
          schema={z.object({
            type: z.literal("FeatureCollection"),
            features: z.array(z.any()).length(2),
          })}
          actual={filteredFeatures}
        />
      </Bubble>
    </>
  );
}
