import { type ReactNode, useMemo } from "react";
import {
  Image,
  type ImageRequireSource,
  type ImageResolvedAssetSource,
  type ImageSourcePropType,
  type ImageURISource,
  type NativeSyntheticEvent,
} from "react-native";

import ImagesNativeComponent, {
  type NativeImageEntry,
} from "./ImagesNativeComponent";
import { type BaseProps } from "../../types/BaseProps";

export const NATIVE_MODULE_NAME = "MLRNImages";

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type ImageSourceWithSdf = {
  source: ImageSourcePropType;
  sdf?: boolean;
};

export type ImageEntry =
  | string
  | ImageRequireSource
  | ImageURISource[]
  | XOR<ImageURISource, ImageSourceWithSdf>;

export interface ImagesProps extends BaseProps {
  /**
   * Specifies the images in key-value pairs required for the style.
   * Keys are names used in style expressions (e.g., iconImage).
   *
   * Values can be:
   * - A string URL: `"https://example.com/icon.png"`
   * - A native asset name: `"pin"` (from xcassets on iOS or drawable on Android)
   * - A require import: `require('./icon.png')`
   * - An object with uri: `{ uri: 'https://...' }`
   * - An SDF image: `{ source: require('./icon.png'), sdf: true }`
   *
   * @example
   * ```tsx
   * <Images
   *   images={{
   *     pin: require('./pin.png'),
   *     marker: 'marker', // native asset
   *     remote: { uri: 'https://example.com/icon.png' },
   *     sdfIcon: { source: require('./icon.png'), sdf: true },
   *   }}
   * />
   * ```
   */
  images?: { [key: string]: ImageEntry };

  /**
   * @deprecated Use the `images` prop with native asset names as string values instead.
   *
   * If you have an asset under Image.xcassets on iOS and the drawables directory on Android,
   * you can now specify them directly in the `images` prop:
   *
   * @example
   * ```tsx
   * // Before (deprecated):
   * <Images nativeAssetImages={['pin', 'marker']} />
   *
   * // After:
   * <Images images={{ pin: 'pin', marker: 'marker' }} />
   * ```
   */
  nativeAssetImages?: string[];

  /**
   * Called when a layer references an image that is not present in the style.
   * You can use this to dynamically add images on demand.
   *
   * @example
   * ```tsx
   * <Images
   *   images={images}
   *   onImageMissing={(imageKey) => {
   *     setImages(prev => ({ ...prev, [imageKey]: fallbackIcon }));
   *   }}
   * />
   * ```
   */
  onImageMissing?: (imageKey: string) => void;

  children?: ReactNode;
}

/**
 * Resolves an ImageEntry to the native format.
 * - Strings are passed through (native assets or URLs)
 * - require() imports are resolved to { uri, scale }
 * - Objects with 'source' are resolved with sdf flag
 */
function resolveImageEntry(
  value: ImageEntry,
): NativeImageEntry {
  // String values are passed through - can be URLs or native asset names
  if (typeof value === "string") {
    return value;
  }

  // Handle SDF images with source property
  if (typeof value === "object" && "source" in value && value.source) {
    const resolved = Image.resolveAssetSource(value.source);
    return {
      uri: resolved.uri,
      scale: resolved.scale,
      sdf: value.sdf,
    };
  }

  // Handle require() imports and other image sources
  const resolved: ImageResolvedAssetSource = Image.resolveAssetSource(
    value as ImageRequireSource | ImageURISource | ImageURISource[],
  );
  return {
    uri: resolved.uri,
    scale: resolved.scale,
  };
}

/**
 * Images defines the images used in Symbol layers.
 *
 * Use this component to add images to the map style that can be referenced
 * by symbol layers using the `iconImage` property.
 */
export const Images = ({
  testID,
  images,
  nativeAssetImages,
  onImageMissing,
  children,
}: ImagesProps) => {
  const nativeImages = useMemo(() => {
    const result: Record<string, NativeImageEntry> = {};

    // Process images prop
    if (images) {
      Object.entries(images).forEach(([imageName, value]) => {
        result[imageName] = resolveImageEntry(value);
      });
    }

    // Process deprecated nativeAssetImages prop
    // Native assets are passed as strings - the native side will load them
    if (nativeAssetImages) {
      nativeAssetImages.forEach((assetName) => {
        // Only add if not already defined in images
        if (!(assetName in result)) {
          result[assetName] = assetName;
        }
      });
    }

    return result;
  }, [images, nativeAssetImages]);

  const handleImageMissing = useMemo(() => {
    if (!onImageMissing) {
      return undefined;
    }
    return (event: NativeSyntheticEvent<{ imageKey: string }>) => {
      onImageMissing(event.nativeEvent.imageKey);
    };
  }, [onImageMissing]);

  return (
    <ImagesNativeComponent
      testID={testID}
      images={nativeImages}
      hasOnImageMissing={!!onImageMissing}
      onImageMissing={handleImageMissing}
    >
      {children}
    </ImagesNativeComponent>
  );
};
