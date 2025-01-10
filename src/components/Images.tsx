import { type ReactNode } from "react";
import {
  Image,
  type ImageSourcePropType,
  type ImageURISource,
  type NativeSyntheticEvent,
  requireNativeComponent,
} from "react-native";

import { type BaseProps } from "../types/BaseProps";

export const NATIVE_MODULE_NAME = "MLRNImages";

export type ImageEntry = string | ImageSourcePropType;

function _isUrlOrPath(value: ImageEntry): boolean {
  return (
    (typeof value === "string" || value instanceof String) &&
    (value.startsWith("file://") ||
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:") ||
      value.startsWith("asset://") ||
      value.startsWith("/"))
  );
}

function _isImageSourcePropType(
  value: ImageEntry,
): value is ImageSourcePropType {
  if (typeof value === "number" || value instanceof Number) {
    return true;
  }
  const valueAsSource = value as ImageURISource;
  return !!valueAsSource.uri && typeof valueAsSource.uri === "string";
}

interface ImagesProps extends BaseProps {
  /**
   * Specifies the external images in key-value pairs required for the shape source.
   * Keys are names - see iconImage expressions, values can be either urls-s objects
   * with format `{uri: 'http://...'}` or `require('image.png')` or `import "image.png"`
   */
  images?: { [key: string]: ImageEntry };
  /**
   * If you have an asset under Image.xcassets on iOS and the drawables directory on android
   * you can specify an array of string names with assets as the key `['pin']`.
   */
  nativeAssetImages?: string[];
  /**
   * Gets called when a Layer is trying to render an image whose key is not present in
   * any of the `Images` component of the Map.
   */
  onImageMissing?(imageKey: string): void;

  id?: string;

  children?: ReactNode;
}

/**
 * Images defines the images used in Symbol etc layers
 */
export const Images = ({
  images,
  nativeAssetImages,
  onImageMissing,
  id,
  children,
}: ImagesProps) => {
  const _getImages = (): {
    images?: { [key: string]: ImageEntry };
    nativeImages?: ImageEntry[];
  } => {
    if (!images && !nativeAssetImages) {
      return {};
    }

    const imagesResult: { [key: string]: ImageEntry } = {};
    let nativeImages: ImageEntry[] = [];

    if (images) {
      const imageNames = Object.keys(images);
      for (const imageName of imageNames) {
        const value = images[imageName];
        if (value && _isUrlOrPath(value)) {
          imagesResult[imageName] = value;
        } else if (value && _isImageSourcePropType(value)) {
          const res = Image.resolveAssetSource(value);
          if (res && res.uri) {
            imagesResult[imageName] = res;
          }
        }
      }
    }

    if (nativeAssetImages) {
      nativeImages = nativeAssetImages;
    }

    return {
      images: imagesResult,
      nativeImages,
    };
  };

  const _onImageMissing = (
    event: NativeSyntheticEvent<{ payload: { imageKey: string } }>,
  ): void => {
    if (onImageMissing) {
      onImageMissing(event.nativeEvent.payload.imageKey);
    }
  };

  const props = {
    id,
    hasOnImageMissing: !!onImageMissing,
    onImageMissing: _onImageMissing,
    ..._getImages(),
  };

  return <MLRNImages {...props}>{children}</MLRNImages>;
};

const MLRNImages = requireNativeComponent(NATIVE_MODULE_NAME);
