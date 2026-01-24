import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type ImageMissingEvent = {
  imageKey: string;
};

/**
 * Native image entry format after resolution.
 * - For remote images: { uri: string, scale?: number, sdf?: boolean }
 * - For native assets: string (asset name)
 */
export type NativeImageEntry =
  | string
  | {
      uri: string;
      scale?: number;
      sdf?: boolean;
    };

export interface NativeProps extends ViewProps {
  /**
   * Images to add to the map style.
   * Keys are image names used in style expressions.
   * Values can be:
   * - Remote images: { uri: string, scale?: number, sdf?: boolean }
   * - Native assets: string (name of asset in xcassets/drawable)
   */
  images?: UnsafeMixed<Record<string, NativeImageEntry>>;

  /**
   * Whether the onImageMissing callback is set.
   * Used to optimize native event dispatching.
   */
  hasOnImageMissing?: boolean;

  /**
   * Called when a layer references an image that is not present in the style.
   */
  onImageMissing?: CodegenTypes.BubblingEventHandler<ImageMissingEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNImages",
) as HostComponent<NativeProps>;
