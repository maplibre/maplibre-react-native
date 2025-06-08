import type { Double } from "react-native/Libraries/Types/CodegenTypes";

export type NativeCameraStop = {
  centerCoordinate?: string;
  zoom?: Double;

  bounds?: string;

  paddingTop?: Double;
  paddingRight?: Double;
  paddingBottom?: Double;
  paddingLeft?: Double;

  heading?: Double;
  pitch?: Double;

  duration?: Double;
  mode?: 1 | 2 | 3 | 4;
};
