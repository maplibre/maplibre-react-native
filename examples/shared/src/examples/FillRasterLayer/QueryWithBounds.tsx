import {
  Camera,
  FillLayer,
  MapView,
  type MapViewRef,
  ShapeSource,
  StyleURL,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import React, { useMemo, useRef, useState } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "../../assets/geojson/new-york-city-districts.json";
import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

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

export const QueryWithBounds: React.FC = () => {
  const mapRef = useRef<MapViewRef>(null);
  const [bounds, setBounds] = useState<number[]>();
  const [selected, setSelected] = useState<FeatureCollection>();

  const message = useMemo(() => {
    if (bounds?.length === 1) {
      return "Press in one more location to close the rect";
    }

    return "Press in two different locations to form a rect to query with";
  }, [bounds]);

  return (
    <>
      <MapView
        ref={mapRef}
        onPress={async (event) => {
          const { longitude, latitude } = event.nativeEvent;
          const newBounds = [...(bounds ?? []), longitude, latitude];
          if (newBounds.length === 4 && mapRef.current) {
            const minX = Math.min(newBounds[0]!, newBounds[2]!);
            const maxX = Math.max(newBounds[0]!, newBounds[2]!);
            const minY = Math.min(newBounds[1]!, newBounds[3]!);
            const maxY = Math.max(newBounds[1]!, newBounds[3]!);

            const featureCollection =
              await mapRef.current.queryRenderedFeatures(
                [minX, minY, maxX, maxY],
                { layers: ["nycFill"] },
              );
            setSelected(
              featureCollection.features?.length
                ? featureCollection
                : undefined,
            );
            setBounds(undefined);
          } else {
            setBounds(newBounds);
          }
        }}
        style={sheet.matchParent}
        mapStyle={StyleURL.Default}
      >
        <Camera zoom={9} longitude={-73.970895} latitude={40.723279} />

        <ShapeSource
          id="nyc"
          shape={newYorkCityDistrictsFeatureCollection as any}
        >
          <FillLayer id="nycFill" style={styles.neighborhoods} />
        </ShapeSource>

        {selected ? (
          <ShapeSource id="selectedNYC" shape={selected as any}>
            <FillLayer
              id="selectedNYCFill"
              style={styles.selectedNeighborhoods}
            />
          </ShapeSource>
        ) : null}
      </MapView>

      <Bubble>
        <Text style={styles.bubbleText}>{message}</Text>
      </Bubble>
    </>
  );
};
