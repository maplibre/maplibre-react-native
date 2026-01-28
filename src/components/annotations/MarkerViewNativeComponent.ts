import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type NativeAnchor = {
  x: CodegenTypes.Double;
  y: CodegenTypes.Double;
};

type NativeOffset = {
  x: CodegenTypes.Double;
  y: CodegenTypes.Double;
};

export interface NativeProps extends ViewProps {
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  anchor?: NativeAnchor;
  offset?: NativeOffset;
  allowOverlap?: CodegenTypes.WithDefault<boolean, false>;
  isSelected?: CodegenTypes.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNMarkerView",
) as HostComponent<NativeProps>;
