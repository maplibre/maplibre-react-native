import type { HostComponent, ViewProps } from "react-native";
import type {
  DirectEventHandler,
  Double,
  Int32,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { NativeCameraStop } from "../../types/codegen/NativeCameraStop";
import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

/**
 * TODO: Move to codegen include?
 *
 * TODO: CLARIFY
 * In fabric type spec we use compassEnabled?: OptionalProp<boolean> instead of
 * compassEnabled?: boolean. Fabric converts those optional to boolean, with
 * default values, but when we render MapView without compassEnabled we want it
 * o be rendered what's the default by Mapbox, so null.
 * https://github.com/rnmapbox/maps/pull/3082#discussion_r1339858750
 */
export type OptionalProp<T> = UnsafeMixed<T>;

export const UserTrackingMode = {
  Follow: "normal",
  FollowWithHeading: "compass",
  FollowWithCourse: "course",
} as const;

// TODO
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UserTrackingMode =
  (typeof UserTrackingMode)[keyof typeof UserTrackingMode];

export type UserTrackingModeChangeEvent = {
  followUserLocation: boolean;
  // TODO: Type with enum?
  followUserMode: string;
};

export interface NativeProps extends ViewProps {
  defaultStop?: UnsafeMixed<NativeCameraStop>;
  stop?: UnsafeMixed<NativeCameraStop>;
  zoomLevel?: Double;
  minZoomLevel?: Double;
  maxZoomLevel?: Double;
  maxBounds?: string;

  animationDuration?: Double;
  animationMode?: string;

  followUserLocation?: boolean;
  followUserMode?: string;
  followZoomLevel?: Double;
  followPitch?: Double;
  followHeading?: Double;
  followPadding?: UnsafeMixed<any>;

  userTrackingMode?: Int32;
  onUserTrackingModeChange?: DirectEventHandler<UserTrackingModeChangeEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNCamera",
) as HostComponent<NativeProps>;
