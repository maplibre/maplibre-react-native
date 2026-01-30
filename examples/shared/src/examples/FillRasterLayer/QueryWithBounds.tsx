import {
  Camera,
  FillLayer,
  GeoJSONSource,
  MapView,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { useMemo, useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "@/assets/geojson/new-york-city-districts.json";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = {
  neighborhoods: {
    fillAntialias: true,
    fillColor: "blue",
    fillOutlineColor: "black",
    fillOpacity: 0.84,
  },
  selectedNeighborhoods: {
    fillAntialias: true,
    fillColor: "green",
    fillOpacity: 0.84,
  },
  bubbleText: { textAlign: "center" as const },
};

export function QueryWithBounds() {
  const mapViewRef = useRef<MapViewRef>(null);
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
      <MapView
        ref={mapViewRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          const [x, y] = event.nativeEvent.point;
          const pixelBounds = [...(bounds ?? []), x, y];
          if (pixelBounds.length === 4 && mapViewRef.current) {
            const minX = Math.min(pixelBounds[0]!, pixelBounds[2]!);
            const minY = Math.min(pixelBounds[1]!, pixelBounds[3]!);
            const maxX = Math.max(pixelBounds[0]!, pixelBounds[2]!);
            const maxY = Math.max(pixelBounds[1]!, pixelBounds[3]!);

            const features = await mapViewRef.current.queryRenderedFeatures(
              [
                [minX, minY],
                [maxX, maxY],
              ],
              { layers: ["nycFill"] },
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
          id="nyc"
          data={
            newYorkCityDistrictsFeatureCollection as GeoJSON.FeatureCollection
          }
        >
          <FillLayer id="nycFill" style={styles.neighborhoods} />
        </GeoJSONSource>

        {selected ? (
          <GeoJSONSource
            id="selectedNYC"
            data={{ type: "FeatureCollection", features: selected }}
          >
            <FillLayer
              id="selectedNYCFill"
              style={styles.selectedNeighborhoods}
            />
          </GeoJSONSource>
        ) : null}
      </MapView>

      <Bubble>
        <Text style={styles.bubbleText}>{message}</Text>
      </Bubble>
    </>
  );
}
