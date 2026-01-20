import { memo } from "react";

import { UserLocationPuckHeading } from "./UserLocationPuckHeading";
import type { BaseProps } from "../../types/BaseProps";
import type { CircleLayerStyle } from "../../types/MapLibreRNStyles";
import { CircleLayer } from "../layers/CircleLayer";

const blue = "#33B5E5";

const layerStyles = {
  accuracy: {
    circleColor: blue,
    circleOpacity: 0.2,
    circlePitchAlignment: "map",
    circleRadiusTransition: { duration: 300, delay: 0 },
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
} satisfies Record<"accuracy" | "white" | "blue", CircleLayerStyle>;

interface UserLocationPuckProps extends BaseProps {
  sourceID: string;
  accuracy?: number;
  heading?: number;
  belowLayerID?: string;
}

export const UserLocationPuck = memo(
  ({ sourceID, accuracy, heading }: UserLocationPuckProps) => {
    return (
      <>
        {typeof accuracy === "number" && (
          <CircleLayer
            id="mlrn-user-location-puck-accuracy"
            testID="mlrn-user-location-puck-accuracy"
            source={sourceID}
            style={{
              ...layerStyles.accuracy,
              circleRadius: [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                0,
                layerStyles.white.circleRadius,
                22,
                layerStyles.white.circleRadius + accuracy * 100,
              ],
            }}
          />
        )}
        <CircleLayer
          id="mlrn-user-location-puck-white"
          testID="mlrn-user-location-puck-white"
          source={sourceID}
          style={layerStyles.white}
        />
        <CircleLayer
          id="mlrn-user-location-puck-blue"
          testID="mlrn-user-location-puck-blue"
          source={sourceID}
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
    );
  },
);
