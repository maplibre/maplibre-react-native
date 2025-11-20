import { memo, type ReactNode, useMemo } from "react";

import { UserLocationPuck } from "./UserLocationPuck";
import { useUserLocation } from "../../hooks/useUserLocation";
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
   * Render an arrow which indicates direction the device is pointing relative to north
   */
  heading?: boolean;

  /**
   * Minimum delta in meters for location updates
   */
  minDisplacement?: number;

  /**
   * Even triggered on pressing the UserLocation Annotation
   */
  onPress?: () => void;
}

export const UserLocation = memo(
  ({
    animated = true,
    heading = false,
    minDisplacement,
    children,
    onPress,
  }: UserLocationProps) => {
    const geolocationPosition = useUserLocation({ minDisplacement });

    const coordinates = useMemo(() => {
      return geolocationPosition?.coords
        ? [
            geolocationPosition.coords.longitude,
            geolocationPosition.coords.latitude,
          ]
        : undefined;
    }, [geolocationPosition?.coords]);

    if (!geolocationPosition) {
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
          iconRotate: geolocationPosition.coords.heading,
        }}
      >
        {children || (
          <UserLocationPuck
            testID="mlrn-user-location-puck"
            sourceID="mlrn-user-location"
            heading={heading ? currentPosition?.coords.heading : undefined}
          />
        )}
      </Annotation>
    );
  },
);
