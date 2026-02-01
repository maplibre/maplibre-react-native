import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from "react-native";

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  "MLRNCallout",
) as HostComponent<NativeProps>;
