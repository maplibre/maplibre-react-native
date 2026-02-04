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
  const geoJSONSourceRef = useRef<GeoJSONSourceRef>(null);
  const [allFeatures, setAllFeatures] = useState<GeoJSON.FeatureCollection>();
  const [filteredFeatures, setFilteredFeatures] =
    useState<GeoJSON.FeatureCollection>();

  return (
    <>
      <Map testID="map-view" mapStyle={MAPLIBRE_DEMO_STYLE}>
        <GeoJSONSource ref={geoJSONSourceRef} data={FEATURES}>
          <Layer
            type="circle"
            id="test-layer"
            style={{
              circleRadius: 8,
              circleColor: colors.blue,
            }}
          />
        </GeoJSONSource>
      </Map>
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setAllFeatures(await geoJSONSourceRef.current?.getData());

            setFilteredFeatures(
              await geoJSONSourceRef.current?.getData([
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
