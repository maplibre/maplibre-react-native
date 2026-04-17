import type { SymbolLayerSpecification } from "@maplibre/maplibre-gl-style-spec";
import { memo } from "react";

import { type BaseProps } from "../../types/BaseProps";
import { Layer } from "../layer/Layer";

const SYMBOL_LAYER_LAYOUT: SymbolLayerSpecification["layout"] = {
  "icon-image": "mlrn-user-location-puck-heading",
  "icon-allow-overlap": true,
  "icon-pitch-alignment": "map",
  "icon-rotation-alignment": "map",
};

interface UserLocationPuckHeadingProps extends BaseProps {
  source: string;
  beforeId?: string;
  heading: number;
}

export const UserLocationPuckHeading = memo(
  ({ source, beforeId, heading }: UserLocationPuckHeadingProps) => (
    <Layer
      type="symbol"
      id="mlrn-user-location-puck-heading"
      testID="mlrn-user-location-puck-heading"
      source={source}
      beforeId={beforeId}
      layout={{
        ...SYMBOL_LAYER_LAYOUT,
        "icon-rotate": heading,
      }}
    />
  ),
);
