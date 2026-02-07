import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  type MapRef,
} from "@maplibre/maplibre-react-native";
import { useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const LAYER = "fill";

export function QueryWithBounds() {
  const mapRef = useRef<MapRef>(null);
  const [bounds, setBounds] = useState<number[]>();
  const [selected, setSelected] = useState<GeoJSON.Feature[]>();

  const message = useMemo(() => {
    if (bounds?.length === 1) {
      return "Press in one more location to close the rect";
    }

    return "Press in two different locations to form a rect to query with";
  }, [bounds]);

  return (
    <>
      <Map
        ref={mapRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          const [x, y] = event.nativeEvent.point;

          const pixelBounds = [...(bounds ?? []), x, y];
          if (pixelBounds.length === 4 && mapRef.current) {
            const minX = Math.min(pixelBounds[0]!, pixelBounds[2]!);
            const minY = Math.min(pixelBounds[1]!, pixelBounds[3]!);
            const maxX = Math.max(pixelBounds[0]!, pixelBounds[2]!);
            const maxY = Math.max(pixelBounds[1]!, pixelBounds[3]!);

            const features = await mapRef.current.queryRenderedFeatures(
              [
                [minX, minY],
                [maxX, maxY],
              ],
              { layers: [LAYER] },
            );
            setSelected(features);
            setBounds(undefined);
          } else {
            setBounds(pixelBounds);
          }
        }}
      >
        <Camera zoom={9} center={[-73.970895, 40.723279]} />

        <GeoJSONSource
          data={
            newYorkCityDistrictsFeatureCollection as GeoJSON.FeatureCollection
          }
        >
          <Layer
            id={LAYER}
            type="fill"
            paint={{
              "fill-antialias": true,
              "fill-color": "blue",
              "fill-outline-color": "black",
              "fill-opacity": 0.84,
            }}
          />
        </GeoJSONSource>

        {selected ? (
          <GeoJSONSource
            data={{ type: "FeatureCollection", features: selected }}
          >
            <Layer
              type="fill"
              paint={{
                "fill-antialias": true,
                "fill-color": "green",
                "fill-opacity": 0.84,
              }}
            />
          </GeoJSONSource>
        ) : null}
      </Map>

      <Bubble>
        <Text style={{ textAlign: "center" }}>{message}</Text>
      </Bubble>
    </>
  );
}
