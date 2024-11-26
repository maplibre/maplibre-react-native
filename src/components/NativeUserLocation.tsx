import { type ReactElement } from "react";
import { requireNativeComponent } from "react-native";

const NATIVE_MODULE_NAME = "RCTMLNNativeUserLocation";

interface NativeUserLocationProps {
  /**
   * Android render mode.
   *
   *  - normal: just a circle
   *  - compass: triangle with heading
   *  - gps: large arrow
   *
   * @platform android
   */
  androidRenderMode?: "normal" | "compass" | "gps";
  /**
   * iOS only. A Boolean value indicating whether the user location annotation may display a permanent heading indicator.
   *
   * @platform ios
   */
  iosShowsUserHeadingIndicator?: boolean;
  /**
   * Android only. Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX.
   */
  androidPreferredFramesPerSecond?: number;
}

const NativeUserLocation = (props: NativeUserLocationProps): ReactElement => {
  return <RCTMLNNativeUserLocation {...props} />;
};

const RCTMLNNativeUserLocation = requireNativeComponent(NATIVE_MODULE_NAME);

export default NativeUserLocation;
