import { SymbolLayer } from "./SymbolLayer";
import headingIcon from "../assets/heading.png";
import { type BaseProps } from "../types/BaseProps";

const style = {
  iconImage: headingIcon,
  iconAllowOverlap: true,
  iconPitchAlignment: "map",
  iconRotationAlignment: "map",
} as const;

interface HeadingIndicatorProps extends BaseProps {
  heading?: number;
}

export const HeadingIndicator = ({ heading }: HeadingIndicatorProps) => (
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
