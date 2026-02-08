import {
  Camera,
  Layer,
  GeoJSONSource,
  Map,
  type MapRef,
} from "@maplibre/maplibre-react-native";
import { useMemo, useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

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
          const [longitude, latitude] = event.nativeEvent.lngLat;
          const newBounds = [...(bounds ?? []), longitude, latitude];
          if (newBounds.length === 4 && mapRef.current) {
            const minX = Math.min(newBounds[0]!, newBounds[2]!);
            const maxX = Math.max(newBounds[0]!, newBounds[2]!);
            const minY = Math.min(newBounds[1]!, newBounds[3]!);
            const maxY = Math.max(newBounds[1]!, newBounds[3]!);

            const features = await mapRef.current.queryRenderedFeatures(
              [
                [minX, minY],
                [maxX, maxY],
              ],
              { layers: ["nycFill"] },
            );
            setSelected(features);
            setBounds(undefined);
          } else {
            setBounds(newBounds);
          }
        }}
      >
        <Camera zoom={9} center={[-73.970895, 40.723279]} />

        <GeoJSONSource
          id="nyc"
          data={
            newYorkCityDistrictsFeatureCollection as GeoJSON.FeatureCollection
          }
        >
          <Layer
            type="fill"
            id="nycFill"
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
            id="selectedNYC"
            data={{ type: "FeatureCollection", features: selected }}
          >
            <Layer
              type="fill"
              id="selectedNYCFill"
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
