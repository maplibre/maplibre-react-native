import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from "react-native";
import type * as CodegenTypes from "react-native/Libraries/Types/CodegenTypes";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";
import { type StyleValue } from "../../utils/StyleValue";

export interface NativeProps extends ViewProps {
  id: string;
  layerType: string;

  source?: string;
  sourceLayer?: string;

  afterId?: string;
  beforeId?: string;
  layerIndex?: CodegenTypes.Int32;

  minzoom?: CodegenTypes.Double;
  maxzoom?: CodegenTypes.Double;

  filter?: UnsafeMixed<unknown[]>;
  reactStyle?: UnsafeMixed<Record<string, StyleValue>>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNLayer",
) as HostComponent<NativeProps>;
