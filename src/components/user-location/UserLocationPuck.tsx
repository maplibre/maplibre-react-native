import { memo } from "react";

import { UserLocationPuckHeading } from "./UserLocationPuckHeading";
import type { BaseProps } from "../../types/BaseProps";
import type { CircleLayerStyle } from "../../types/MapLibreRNStyles";
import { Layer } from "../layers/Layer";

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
  source: string;
  accuracy?: number;
  heading?: number;
  beforeId?: string;
}

export const UserLocationPuck = memo(
  ({ source, accuracy, heading }: UserLocationPuckProps) => {
    return (
      <>
        {typeof accuracy === "number" && (
          <Layer
            type="circle"
            id="mlrn-user-location-puck-accuracy"
            testID="mlrn-user-location-puck-accuracy"
            source={source}
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
        <Layer
          type="circle"
          id="mlrn-user-location-puck-white"
          testID="mlrn-user-location-puck-white"
          source={source}
          style={layerStyles.white}
        />
        <Layer
          type="circle"
          id="mlrn-user-location-puck-blue"
          testID="mlrn-user-location-puck-blue"
          source={source}
          style={layerStyles.blue}
        />
        {typeof heading === "number" && (
          <UserLocationPuckHeading
            source={source}
            beforeId="mlrn-user-location-puck-white"
            heading={heading}
          />
        )}
      </>
    );
  },
);
