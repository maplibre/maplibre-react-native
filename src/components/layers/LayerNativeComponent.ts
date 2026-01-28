import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";
import { type StyleValue } from "../../utils/StyleValue";

type NativeLayerType =
  | "fill"
  | "line"
  | "symbol"
  | "circle"
  | "heatmap"
  | "fill-extrusion"
  | "raster"
  | "background";

export interface NativeProps extends ViewProps {
  id: string;
  layerType: NativeLayerType;

  source?: string;
  sourceLayer?: string;

  afterId?: string;
  beforeId?: string;
  layerIndex?: number;

  minzoom?: number;
  maxzoom?: number;

  filter?: UnsafeMixed<unknown[]>;
  reactStyle?: UnsafeMixed<Record<string, StyleValue>>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNLayer",
) as HostComponent<NativeProps>;
