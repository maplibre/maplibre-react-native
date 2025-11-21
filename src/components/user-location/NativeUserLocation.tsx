import UserLocationNativeComponent from "./UserLocationNativeComponent";

interface NativeUserLocationProps {
  /**
   * Rendering mode
   *
   *  - "default": Renders only a puck
   *  - "heading": Renders a puck with triangle indicating device heading based on compass
   *  - "course": Android renders an arrow indicating device heading based on GPS course, iOS behaves like mode="heading"
   *
   * @default "default"
   */
  mode?: "default" | "heading" | "course";

  /**
   * Limit the maximum frames per second for location updates on Android
   *
   * Use this setting to limit animation rate of the location puck to decrease the stress on the device's CPU which could improve battery life.
   *
   * @platform android
   */
  androidPreferredFramesPerSecond?: number;
}

export const NativeUserLocation = (props: NativeUserLocationProps) => {
  return <UserLocationNativeComponent {...props} />;
};
