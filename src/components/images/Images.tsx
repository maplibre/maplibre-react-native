import { useMemo } from "react";
import {
  Image,
  type ImageRequireSource,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
} from "react-native";

import ImagesNativeComponent, {
  type NativeImageEntry,
} from "./ImagesNativeComponent";
import { type BaseProps } from "../../types/BaseProps";

export type ImageSourceWithSdf = {
  source: ImageSourcePropType;
  sdf?: boolean;
};

export type ImageEntry = string | ImageRequireSource | ImageSourceWithSdf;

export interface ImagesProps extends BaseProps {
  /**
   * Specifies the images in key-value pairs required for the style.
   * Keys are names used in style expressions (e.g., "customIcon").
   *
   * Values provide a `source`, which can be one of the following types:
   * - A string URL: `"https://example.com/icon.png"`
   * - A native asset name: `"pin"` (from xcassets on iOS or drawable on Android)
   * - A require/import: `require('./icon.png')`
   *
   * If your image supports SDF, you can set the `sdf` property to true:
   * `{ source: require('./sdf-icon.png'), sdf: true }`
   *
   * @example
   * ```tsx
   * <Images
   *   images={{
   *     remote: 'https://example.com/marker.png',
   *     require: require('./marker.png'),
   *     native: "marker",
   *     sdf: { source: require('./sdf-marker.png'), sdf: true },
   *   }}
   * />
   * ```
   */
  images: { [key: string]: ImageEntry };

  /**
   * Called when a layer references an image that is not present in the style.
   * You can use this to dynamically add images on demand.
   *
   * @example
   * ```tsx
   * <Images
   *   images={images}
   *   onImageMissing={(event) => {
   *     setImages(prev => ({ ...prev, [event.nativeEvent.image]: fallbackIcon }));
   *   }}
   * />
   * ```
   */
  onImageMissing?: (event: NativeSyntheticEvent<{ image: string }>) => void;
}

/**
 * Images defines the images used in Symbol layers.
 *
 * Use this component to add images to the map style that can be referenced
 * by symbol layers using the `iconImage` property.
 */
export const Images = ({ testID, images, onImageMissing }: ImagesProps) => {
  const nativeImages = useMemo(() => {
    const result: Record<string, NativeImageEntry> = {};

    Object.entries(images).forEach(([imageName, value]) => {
      if (typeof value === "string") {
        result[imageName] = {
          uri: value,
        };
      } else {
        const resolved = Image.resolveAssetSource(
          typeof value === "number" ? value : value.source,
        );

        result[imageName] = {
          uri: resolved.uri,
          scale: resolved.scale,
          sdf: typeof value === "object" ? value.sdf : false,
        };
      }
    });

    return result;
  }, [images]);

  return (
    <ImagesNativeComponent
      testID={testID}
      images={nativeImages}
      onImageMissing={onImageMissing}
    />
  );
};
