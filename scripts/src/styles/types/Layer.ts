import type { LayerSpecification } from "@maplibre/maplibre-gl-style-spec";

import type { LayerProperty } from "./LayerProperty";

export type Layer = {
  name: LayerSpecification["type"] | "light";
  properties: LayerProperty[];
};
