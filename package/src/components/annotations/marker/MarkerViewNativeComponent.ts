import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../../types/codegen/UnsafeMixed";

type NativeAnchor = {
  x?: CodegenTypes.WithDefault<CodegenTypes.Double, 0.5>;
  y?: CodegenTypes.WithDefault<CodegenTypes.Double, 0.5>;
};

type NativeOffset = {
  x: CodegenTypes.Double;
  y: CodegenTypes.Double;
};

type NativeMarkerPressEvent = {
  id: string;
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  point: UnsafeMixed<[x: CodegenTypes.Double, y: CodegenTypes.Double]>;
};

export interface NativeProps extends ViewProps {
  id: string;
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  anchor?: NativeAnchor;
  offset?: NativeOffset;
  onPress?: CodegenTypes.BubblingEventHandler<NativeMarkerPressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNMarkerView",
) as HostComponent<NativeProps>;
