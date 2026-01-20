import { memo } from "react";

import headingIcon from "../../assets/heading.png";
import { type BaseProps } from "../../types/BaseProps";
import type { SymbolLayerStyle } from "../../types/MapLibreRNStyles";
import { SymbolLayer } from "../layers/SymbolLayer";

const layerStyle: SymbolLayerStyle = {
  iconImage: headingIcon,
  iconAllowOverlap: true,
  iconPitchAlignment: "map",
  iconRotationAlignment: "map",
};

interface UserLocationPuckHeadingProps extends BaseProps {
  source: string;
  beforeId?: string;
  heading: number;
}

export const UserLocationPuckHeading = memo(
  ({ source, beforeId, heading }: UserLocationPuckHeadingProps) => (
    <SymbolLayer
      id="mlrn-user-location-puck-heading"
      testID="mlrn-user-location-puck-heading"
      source={source}
      beforeId={beforeId}
      style={{
        ...layerStyle,
        iconRotate: heading,
      }}
    />
  ),
);
