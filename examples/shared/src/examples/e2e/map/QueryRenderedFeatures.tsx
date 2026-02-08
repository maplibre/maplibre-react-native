import {
  Layer,
  Map,
  type MapRef,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button, type LayoutRectangle, Platform, View } from "react-native";

import { AssertEquals } from "@/components/AssertEquals";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const FEATURE: GeoJSON.Feature = {
  type: "Feature",
  properties: { type: "landmark" },
  geometry: { type: "Point", coordinates: [0, 0] },
};

const FEATURES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { type: "restaurant" },
      geometry: { type: "Point", coordinates: [-8, -8] },
    },
    FEATURE,
    {
      type: "Feature",
      properties: { type: "shop" },
      geometry: { type: "Point", coordinates: [8, 8] },
    },
  ],
};

export function QueryRenderedFeatures() {
  const mapRef = useRef<MapRef>(null);
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [featuresPoint, setFeaturesPoint] = useState<GeoJSON.Feature[]>();
  const [featuresBounds, setFeaturesBounds] = useState<GeoJSON.Feature[]>();
  const [featuresViewport, setFeaturesViewport] = useState<GeoJSON.Feature[]>();

  console.log(featuresViewport);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout);
      }}
    >
      <Map ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE}>
        <GeoJSONSource data={FEATURES}>
          <Layer
            type="circle"
            id="circles"
            paint={{
              "circle-radius": 10,
              "circle-color": colors.blue,
            }}
          />
        </GeoJSONSource>
      </Map>

      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            if (!layout) {
              return;
            }

            setFeaturesPoint(
              await mapRef.current?.queryRenderedFeatures(
                [layout.width / 2, layout.height / 2],
                { layers: ["circles"] },
              ),
            );

            setFeaturesBounds(
              await mapRef.current?.queryRenderedFeatures(
                [
                  [layout.width / 2 - 100, layout.height / 2 - 100],
                  [layout.width / 2 + 100, layout.height / 2 + 100],
                ],
                { layers: ["circles"] },
              ),
            );

            console.log(layout);

            setFeaturesViewport(
              await mapRef.current?.queryRenderedFeatures({
                layers: ["circles"],
              }),
            );
          }}
        />
        <AssertEquals
          expect={[{ ...FEATURE, ...Platform.select({ android: { id: "" } }) }]}
          actual={featuresPoint}
        />

        <AssertEquals
          expect={FEATURES.features.length}
          actual={featuresBounds?.length}
        />

        <AssertEquals
          expect={FEATURES.features.length}
          actual={featuresViewport?.length}
        />
      </Bubble>
    </View>
  );
}
