import {
  Camera,
  GeoJSONSource,
  type GeoJSONSourceRef,
  Images,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import maplibreBlackWhiteIcon from "@/assets/images/maplibre-black-white.png";
import maplibreIcon from "@/assets/images/maplibre.png";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const INACTIVE_ICON = "icon-inactive";
const ACTIVE_ICON = "icon-active";

const CITIES: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: [
    { id: 1, name: "Lisbon", coordinates: [-9.14, 38.72] },
    { id: 2, name: "Madrid", coordinates: [-3.7, 40.42] },
    { id: 3, name: "Paris", coordinates: [2.35, 48.86] },
    { id: 4, name: "Berlin", coordinates: [13.4, 52.52] },
    { id: 5, name: "Rome", coordinates: [12.5, 41.9] },
    { id: 6, name: "Vienna", coordinates: [16.37, 48.21] },
    { id: 7, name: "Warsaw", coordinates: [21.01, 52.23] },
    { id: 8, name: "Stockholm", coordinates: [18.07, 59.33] },
  ].map(({ id, name, coordinates }) => ({
    type: "Feature",
    id,
    properties: { name },
    geometry: { type: "Point", coordinates },
  })),
};

/**
 * `icon-image` is a layout property and cannot read `feature-state` . To swap
 * icons at runtime, render two symbol layers on the same source, each with a
 * fixed `icon-image` , and switch between them through the paint property
 * `icon-opacity` , which does support `feature-state` .
 */
export function SymbolLayerIconFeatureState() {
  const sourceRef = useRef<GeoJSONSourceRef>(null);
  const [activeCount, setActiveCount] = useState(0);

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera zoom={3} center={[9, 49]} />

        <Images
          images={{
            [INACTIVE_ICON]: maplibreBlackWhiteIcon,
            [ACTIVE_ICON]: maplibreIcon,
          }}
        />

        <GeoJSONSource
          ref={sourceRef}
          id="cities"
          data={CITIES}
          hitbox={{ top: 16, right: 16, bottom: 16, left: 16 }}
          onPress={async (event) => {
            const feature = event.nativeEvent.features[0];
            if (!sourceRef.current || feature?.id === undefined) return;

            const state = await sourceRef.current.getFeatureState({
              featureId: feature.id,
            });
            const active = state?.active === true;

            await sourceRef.current.setFeatureState(
              { featureId: feature.id },
              { active: !active },
            );
            setActiveCount((count) => count + (active ? -1 : 1));
          }}
        >
          <Layer
            type="symbol"
            id="cities-inactive"
            layout={{
              "icon-image": INACTIVE_ICON,
              "icon-size": 0.6,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-anchor": "top",
              "text-offset": [0, 0.3],
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            }}
            paint={{
              "icon-opacity": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                0,
                1,
              ],
              "text-color": "#2c3e50",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1,
            }}
          />

          <Layer
            type="symbol"
            id="cities-active"
            layout={{
              "icon-image": ACTIVE_ICON,
              "icon-size": 0.6,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            }}
            paint={{
              "icon-opacity": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                1,
                0,
              ],
            }}
          />
        </GeoJSONSource>
      </Map>

      <Bubble
        onPress={async () => {
          await sourceRef.current?.removeFeatureState();
          setActiveCount(0);
        }}
      >
        <Text>Press a city to toggle its icon. Active: {activeCount}</Text>
        <Text>Press here to deactivate all.</Text>
      </Bubble>
    </>
  );
}
