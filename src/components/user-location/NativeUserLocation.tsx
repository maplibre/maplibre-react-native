import UserLocationNativeComponent from "./UserLocationNativeComponent";

interface NativeUserLocationProps {
  /**
   * Rendering mode
   *
   *  - "default": Renders only a puck
   *  - "heading": Renders a puck with triangle indicating device heading based on compass
   *  - "course": On Android renders an arrow indicating device heading based on GPS course, iOS behaves like mode="heading"
   *
   * @default "default"
   */
  mode?: "default" | "heading" | "course";

  /**
   * Limit the maximum frames per second for location updates on Android
   *
   * Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX.
   *
   * @platform android
   */
  androidPreferredFramesPerSecond?: number;
}

export const NativeUserLocation = (props: NativeUserLocationProps) => {
  return <UserLocationNativeComponent {...props} />;
};
