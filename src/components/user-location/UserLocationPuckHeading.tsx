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
  sourceID: string;
  belowLayerID?: string;
  heading: number;
}

export const UserLocationPuckHeading = memo(
  ({ sourceID, belowLayerID, heading }: UserLocationPuckHeadingProps) => (
    <SymbolLayer
      id="mlrn-user-location-puck-heading"
      sourceID={sourceID}
      belowLayerID={belowLayerID}
      style={{
        iconRotate: heading,
        ...layerStyle,
      }}
    />
  ),
);
