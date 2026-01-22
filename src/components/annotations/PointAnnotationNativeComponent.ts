import {
  codegenNativeCommands,
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

type NativeAnnotationEvent = {
  id: string;
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  point: UnsafeMixed<[x: CodegenTypes.Double, y: CodegenTypes.Double]>;
};

export interface NativeProps extends ViewProps {
  id: string;
  title?: string;
  snippet?: string;
  selected?: CodegenTypes.WithDefault<boolean, false>;
  draggable?: CodegenTypes.WithDefault<boolean, false>;
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  anchor?: NativeAnchor;

  onSelected?: CodegenTypes.BubblingEventHandler<NativeAnnotationEvent>;
  onDeselected?: CodegenTypes.BubblingEventHandler<NativeAnnotationEvent>;
  onDragStart?: CodegenTypes.BubblingEventHandler<NativeAnnotationEvent>;
  onDrag?: CodegenTypes.BubblingEventHandler<NativeAnnotationEvent>;
  onDragEnd?: CodegenTypes.BubblingEventHandler<NativeAnnotationEvent>;
}

interface NativeCommands {
  refresh: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ["refresh"],
});

export default codegenNativeComponent<NativeProps>(
  "MLRNPointAnnotation",
) as HostComponent<NativeProps>;
