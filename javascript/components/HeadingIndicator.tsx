import React, { ReactElement } from "react";

import SymbolLayer from "./SymbolLayer";
// @ts-ignore
import headingIcon from "../../assets/heading.png";
import BaseProps from "../types/BaseProps";

const style = {
  iconImage: headingIcon,
  iconAllowOverlap: true,
  iconPitchAlignment: "map",
  iconRotationAlignment: "map",
} as const;

interface HeadingIndicatorProps extends BaseProps {
  heading?: number;
}

const HeadingIndicator = ({ heading }: HeadingIndicatorProps): ReactElement => (
  <SymbolLayer
    key="mapboxUserLocationHeadingIndicator"
    id="mapboxUserLocationHeadingIndicator"
    belowLayerID="mapboxUserLocationWhiteCircle"
    style={{
      iconRotate: heading,
      ...style,
    }}
  />
);

export default HeadingIndicator;
