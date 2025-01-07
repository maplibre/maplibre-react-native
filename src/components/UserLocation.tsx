import {
  forwardRef,
  memo,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Annotation } from "./Annotation";
import { CircleLayer } from "./CircleLayer";
import { HeadingIndicator } from "./HeadingIndicator";
import { NativeUserLocation } from "./NativeUserLocation";
import {
  type Location,
  LocationManager,
} from "../modules/location/LocationManager";
import { type CircleLayerStyle } from "../types/MapLibreRNStyles";

const mapboxBlue = "rgba(51, 181, 229, 100)";

const layerStyles: Record<string, CircleLayerStyle> = {
  pluse: {
    circleRadius: 15,
    circleColor: mapboxBlue,
    circleOpacity: 0.2,
    circlePitchAlignment: "map",
  },
  background: {
    circleRadius: 9,
    circleColor: "#fff",
    circlePitchAlignment: "map",
  },
  foreground: {
    circleRadius: 6,
    circleColor: mapboxBlue,
    circlePitchAlignment: "map",
  },
};

export const normalIcon = (
  showsUserHeadingIndicator?: boolean,
  heading?: number,
) => [
  <CircleLayer
    key="mapboxUserLocationPluseCircle"
    id="mapboxUserLocationPluseCircle"
    style={layerStyles.pluse}
  />,
  <CircleLayer
    key="mapboxUserLocationWhiteCircle"
    id="mapboxUserLocationWhiteCircle"
    style={layerStyles.background}
  />,
  <CircleLayer
    key="mapboxUserLocationBlueCicle"
    id="mapboxUserLocationBlueCicle"
    aboveLayerID="mapboxUserLocationWhiteCircle"
    style={layerStyles.foreground}
  />,
  ...(showsUserHeadingIndicator && heading
    ? [HeadingIndicator({ heading })]
    : []),
];

interface UserLocationProps {
  /**
   * Whether location icon is animated between updates
   */
  animated?: boolean;
  /**
   * Which render mode to use.
   * Can either be `normal` or `native`
   */
  renderMode?: "normal" | "native";
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
   * Whether location icon is visible
   */
  visible?: boolean;
  /**
   * Callback that is triggered on location icon press
   */
  onPress?(): void;
  /**
   * Callback that is triggered on location update
   */
  onUpdate?(location: Location): void;
  /**
   * Show or hide small arrow which indicates direction the device is pointing relative to north.
   */
  showsUserHeadingIndicator?: boolean;
  /**
   * Minimum amount of movement before GPS location is updated in meters
   */
  minDisplacement?: number;
  /**
   * Android only. Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX.
   *
   * @platform android
   */
  androidPreferredFramesPerSecond?: number;
  /**
   * Custom location icon of type mapbox-gl-native components
   *
   * NOTE: Forking maintainer does not understand the above comment.
   */
  children?: ReactNode;
}

interface UserLocationState {
  shouldShowUserLocation: boolean;
  coordinates?: number[];
  heading?: number;
}

export enum UserLocationRenderMode {
  Native = "native",
  Normal = "normal",
}

export interface UserLocationRef {
  setLocationManager: (props: { running: boolean }) => Promise<void>;
  needsLocationManagerRunning: () => boolean;
  _onLocationUpdate: (location: Location | null) => void;
}

export const UserLocation = memo(
  forwardRef<UserLocationRef, UserLocationProps>(
    (
      {
        animated = true,
        visible = true,
        showsUserHeadingIndicator = false,
        minDisplacement = 0,
        renderMode = "normal",
        androidRenderMode,
        androidPreferredFramesPerSecond,
        children,
        onUpdate,
        onPress,
      }: UserLocationProps,
      ref,
    ) => {
      const _isMounted = useRef<boolean | null>(null);
      const locationManagerRunning = useRef<boolean>(false);

      const [userLocationState, setUserLocationState] =
        useState<UserLocationState>({
          shouldShowUserLocation: false,
        });

      useImperativeHandle(
        ref,
        (): UserLocationRef => ({
          /**
           * Whether to start or stop listening to the LocationManager
           *
           * Notice, that listening will start automatically when
           * either `onUpdate` or `visible` are set
           *
           * @async
           * @param {{running: boolean}} running - Object with key `running` and `boolean` value
           * @return {Promise<void>}
           */
          setLocationManager,
          /**
           *
           * If LocationManager should be running
           *
           * @return {boolean}
           */
          needsLocationManagerRunning,
          _onLocationUpdate,
        }),
      );

      useEffect(() => {
        _isMounted.current = true;

        setLocationManager({
          running: needsLocationManagerRunning(),
        }).then(() => {
          if (renderMode === UserLocationRenderMode.Native) {
            return;
          }

          LocationManager.setMinDisplacement(minDisplacement ?? 0);
        });

        return (): void => {
          _isMounted.current = false;
          setLocationManager({ running: false });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        LocationManager.setMinDisplacement(minDisplacement ?? 0);
      }, [minDisplacement]);

      useEffect(() => {
        if (!_isMounted.current) {
          return;
        }

        setLocationManager({
          running: needsLocationManagerRunning(),
        });
      });

      async function setLocationManager({
        running,
      }: {
        running: boolean;
      }): Promise<void> {
        if (locationManagerRunning.current !== running) {
          locationManagerRunning.current = running;

          if (running) {
            LocationManager.addListener(_onLocationUpdate);
            const location = await LocationManager.getLastKnownLocation();
            _onLocationUpdate(location);
          } else {
            LocationManager.removeListener(_onLocationUpdate);
          }
        }
      }

      function needsLocationManagerRunning(): boolean {
        return !!(
          !!onUpdate ||
          (renderMode === UserLocationRenderMode.Normal && visible)
        );
      }

      function _onLocationUpdate(location: Location | null): void {
        if (!_isMounted.current || !location) {
          return;
        }

        let coordinates;
        let heading;

        if (location && location.coords) {
          const { longitude, latitude } = location.coords;
          heading = location.coords.heading;
          coordinates = [longitude, latitude];
        }

        setUserLocationState({
          ...userLocationState,
          coordinates,
          heading,
        });

        if (onUpdate) {
          onUpdate(location);
        }
      }

      if (!visible) {
        return null;
      }

      if (renderMode === UserLocationRenderMode.Native) {
        const props = {
          androidRenderMode,
          iosShowsUserHeadingIndicator: showsUserHeadingIndicator,
          androidPreferredFramesPerSecond,
        };

        return <NativeUserLocation {...props} />;
      }

      if (!userLocationState.coordinates) {
        return null;
      }

      return (
        <Annotation
          animated={animated}
          id="mapboxUserLocation"
          onPress={onPress}
          coordinates={userLocationState.coordinates}
          style={{
            iconRotate: userLocationState.heading,
          }}
        >
          {children ||
            normalIcon(showsUserHeadingIndicator, userLocationState.heading)}
        </Annotation>
      );
    },
  ),
);
