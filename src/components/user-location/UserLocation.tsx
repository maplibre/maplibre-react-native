import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { NativeUserLocation } from "./NativeUserLocation";
import { UserLocationPuck } from "./UserLocationPuck";
import {
  type GeolocationPosition,
  LocationManager,
} from "../../modules/location/LocationManager";
import { Annotation } from "../annotations/Annotation";

export interface UserLocationProps {
  /**
   * Whether location icon is animated between updates
   */
  animated?: boolean;

  /**
   * Which render mode to use
   */
  renderMode?: "default" | "native" | "hidden";

  /**
   * Show or hide small arrow which indicates direction the device is pointing relative to north.
   */
  headingIndicator?: boolean;

  /**
   * native/android only render mode
   *
   *  - normal: just a circle
   *  - compass: triangle with heading
   *  - gps: large arrow
   *
   * @platform android
   */
  androidRenderMode?: "normal" | "compass" | "gps";

  /**
   * Android only. Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX.
   *
   * @platform android
   */
  androidPreferredFramesPerSecond?: number;

  /**
   * Children to render inside the UserLocation Annotation (e.g. CircleLayer, SymbolLayer)
   */
  children?: ReactNode;

  /**
   * Minimum amount of movement before GPS location is updated in meters
   */
  minDisplacement?: number;

  /**
   * Callback that is triggered on location icon press
   */
  onPress?: () => void;

  /**
   * Callback that is triggered on location update
   */
  onUpdate?: (location: GeolocationPosition) => void;
}

export const UserLocation = memo(
  ({
    animated = true,
    headingIndicator = false,
    minDisplacement = 0,
    renderMode = "default",
    androidRenderMode,
    androidPreferredFramesPerSecond,
    children,
    onUpdate,
    onPress,
  }: UserLocationProps) => {
    const [currentPosition, setCurrentPosition] =
      useState<GeolocationPosition>();

    useEffect(() => {
      LocationManager.setMinDisplacement(minDisplacement);
    }, [minDisplacement]);

    const subscribeToLocationManager = !!onUpdate || renderMode === "default";

    const handleUpdate = useCallback(
      (position: GeolocationPosition | null): void => {
        if (!position) {
          return;
        }

        setCurrentPosition(position);

        if (onUpdate) {
          onUpdate(position);
        }
      },
      [onUpdate],
    );

    useEffect(() => {
      if (subscribeToLocationManager) {
        LocationManager.addListener(handleUpdate);
      }

      return () => {
        LocationManager.removeListener(handleUpdate);
      };
    }, [subscribeToLocationManager, handleUpdate]);

    const coordinates = useMemo(() => {
      return currentPosition?.coords
        ? [currentPosition.coords.longitude, currentPosition.coords.latitude]
        : undefined;
    }, [currentPosition?.coords]);

    if (renderMode === "hidden") {
      return null;
    }

    if (renderMode === "native") {
      const props = {
        androidRenderMode,
        iosShowsUserHeadingIndicator: headingIndicator,
        androidPreferredFramesPerSecond,
      };

      return <NativeUserLocation {...props} />;
    }

    if (!currentPosition) {
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
          iconRotate: currentPosition.coords.heading,
        }}
      >
        {children || (
          <UserLocationPuck
            testID="mlrn-user-location-puck"
            sourceID="mlrn-user-location"
            heading={
              headingIndicator ? currentPosition?.coords.heading : undefined
            }
          />
        )}
      </Annotation>
    );
  },
);
