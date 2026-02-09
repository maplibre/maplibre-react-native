import type { CircleLayerSpecification } from "@maplibre/maplibre-gl-style-spec";
import { memo } from "react";

import { UserLocationPuckHeading } from "./UserLocationPuckHeading";
import type { BaseProps } from "../../types/BaseProps";
import { Layer } from "../layer/Layer";

const blue = "#33B5E5";

const CIRCLE_LAYERS_PAINT = {
  accuracy: {
    "circle-color": blue,
    "circle-opacity": 0.2,
    "circle-pitch-alignment": "map",
    "circle-radius-transition": { duration: 300, delay: 0 },
  },
  white: {
    "circle-radius": 9,
    "circle-color": "#fff",
    "circle-pitch-alignment": "map",
  },
  blue: {
    "circle-radius": 6,
    "circle-color": blue,
    "circle-pitch-alignment": "map",
  },
} as const satisfies Record<string, CircleLayerSpecification["paint"]>;

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
            paint={{
              ...CIRCLE_LAYERS_PAINT.accuracy,
              "circle-radius": [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                0,
                CIRCLE_LAYERS_PAINT.white["circle-radius"],
                22,
                CIRCLE_LAYERS_PAINT.white["circle-radius"] + accuracy * 100,
              ],
            }}
          />
        )}
        <Layer
          type="circle"
          id="mlrn-user-location-puck-white"
          testID="mlrn-user-location-puck-white"
          source={source}
          paint={CIRCLE_LAYERS_PAINT.white}
        />
        <Layer
          type="circle"
          id="mlrn-user-location-puck-blue"
          testID="mlrn-user-location-puck-blue"
          source={source}
          paint={CIRCLE_LAYERS_PAINT.blue}
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
