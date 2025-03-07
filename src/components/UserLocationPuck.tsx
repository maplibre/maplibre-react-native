import { memo } from "react";

import { CircleLayer } from "./CircleLayer";
import { UserLocationPuckHeading } from "./UserLocationPuckHeading";
import type { BaseProps } from "../types/BaseProps";
import type { CircleLayerStyle } from "../types/MapLibreRNStyles";

const blue = "#33B5E5";

const layerStyles: Record<"pulse" | "white" | "blue", CircleLayerStyle> = {
  pulse: {
    circleRadius: 15,
    circleColor: blue,
    circleOpacity: 0.2,
    circlePitchAlignment: "map",
  },
  white: {
    circleRadius: 9,
    circleColor: "#fff",
    circlePitchAlignment: "map",
  },
  blue: {
    circleRadius: 6,
    circleColor: blue,
    circlePitchAlignment: "map",
  },
};

interface UserLocationPuckProps extends BaseProps {
  sourceID: string;
  heading?: number;
  belowLayerID?: string;
}

export const UserLocationPuck = memo(
  ({ sourceID, heading }: UserLocationPuckProps) => (
    <>
      <CircleLayer
        id="mlrn-user-location-puck-pulse"
        sourceID={sourceID}
        style={layerStyles.pulse}
      />
      <CircleLayer
        id="mlrn-user-location-puck-white"
        sourceID={sourceID}
        style={layerStyles.white}
      />
      <CircleLayer
        id="mlrn-user-location-puck-blue"
        sourceID={sourceID}
        style={layerStyles.blue}
      />
      {typeof heading === "number" && (
        <UserLocationPuckHeading
          sourceID={sourceID}
          belowLayerID="mlrn-user-location-puck-white"
          heading={heading}
        />
      )}
    </>
  ),
);
