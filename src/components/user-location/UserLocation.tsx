import { memo, type ReactNode, useMemo } from "react";

import { UserLocationPuck } from "./UserLocationPuck";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { Annotation } from "../annotations/Annotation";

export interface UserLocationProps {
  /**
   * Children to render inside the UserLocation Annotation, e.g. CircleLayer, SymbolLayer
   */
  children?: ReactNode;

  /**
   * Whether the UserLocation Annotation is animated between updates
   */
  animated?: boolean;

  /**
   * Render a circle which indicates the accuracy of the location
   */
  accuracy?: boolean;

  /**
   * Render an arrow which indicates direction the device is pointing relative to north
   */
  heading?: boolean;

  /**
   * Minimum delta in meters for location updates
   */
  minDisplacement?: number;

  /**
   * Event triggered on pressing the UserLocation Annotation
   */
  onPress?: () => void;
}

export const UserLocation = memo(
  ({
    animated = true,
    accuracy = false,
    heading = false,
    minDisplacement,
    children,
    onPress,
  }: UserLocationProps) => {
    const currentPosition = useCurrentPosition({ minDisplacement });

    const coordinates = useMemo(() => {
      return currentPosition?.coords
        ? [currentPosition.coords.longitude, currentPosition.coords.latitude]
        : undefined;
    }, [currentPosition?.coords]);

    if (!coordinates || !currentPosition) {
      return null;
    }

    return (
      <Annotation
        animated={animated}
        id="mlrn-user-location"
        testID="mlrn-user-location"
        onPress={onPress}
        coordinates={coordinates}
        style={{
          iconRotate: currentPosition.coords.heading ?? undefined,
        }}
      >
        {children || (
          <UserLocationPuck
            testID="mlrn-user-location-puck"
            source="mlrn-user-location"
            accuracy={accuracy ? currentPosition.coords.accuracy : undefined}
            heading={
              heading
                ? (currentPosition.coords.heading ?? undefined)
                : undefined
            }
          />
        )}
      </Annotation>
    );
  },
);
