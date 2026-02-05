import {
  Camera,
  Layer,
  Map,
  GeoJSONSource,
  type LayerSpecification,
} from "@maplibre/maplibre-react-native";
import { useMemo } from "react";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

// Example: Layer definitions in style-spec JSON format
// These could be loaded from an API, Maputnik export, or shared web/native codebase
const LAYER_DEFINITIONS: LayerSpecification[] = [
  {
    id: "example-fill",
    type: "fill",
    source: "example-source",
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.5,
    },
  },
  {
    id: "example-outline",
    type: "line",
    source: "example-source",
    paint: {
      "line-color": "#066",
      "line-width": 2,
    },
  },
];

// GeoJSON data for demonstration
const GEOJSON_DATA: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-10, 30],
            [10, 30],
            [10, 50],
            [-10, 50],
            [-10, 30],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [20, 30],
            [40, 30],
            [40, 50],
            [20, 50],
            [20, 30],
          ],
        ],
      },
    },
  ],
};

/**
 * Demonstrates JSON interoperability with the Layer component.
 *
 * The Layer component now accepts `paint` and `layout` props with kebab-case
 * property names, matching the MapLibre Style Specification. This enables:
 *
 * 1. Direct use of layer definitions from Maputnik or other style editors
 * 2. Sharing layer styles between web (maplibre-gl-js) and native platforms
 * 3. Loading layer configurations from APIs or JSON files
 * 4. Type-safe autocomplete using LayerSpecification from the style spec
 */
export function StyleJSONInterop() {
  // Layers could be loaded from an API, file, or style editor export
  const layers = useMemo(() => LAYER_DEFINITIONS, []);

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera initialViewState={{ center: [15, 40], zoom: 2 }} />

      <GeoJSONSource id="example-source" data={GEOJSON_DATA}>
        {/* Spread layer definitions directly from JSON! */}
        {layers.map((layer) => (
          <Layer key={layer.id} {...layer} />
        ))}
      </GeoJSONSource>
    </Map>
  );
}
