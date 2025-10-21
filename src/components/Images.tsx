import { type ReactNode, useMemo } from "react";
import {
  Image,
  type ImageResolvedAssetSource,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  requireNativeComponent,
} from "react-native";
import type {
  ImageRequireSource,
  ImageURISource,
} from "react-native/Libraries/Image/ImageSource";

import { type BaseProps } from "../types/BaseProps";

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
  onImageMissing?: (imageKey: string) => void;

  id?: string;

  children?: ReactNode;
}

/**
 * Images defines the images used in Symbol layers
 */
export const Images = ({
  images,
  nativeAssetImages,
  onImageMissing,
  id,
  children,
}: ImagesProps) => {
  const props = useMemo(() => {
    const getImages = (): {
      images?: { [key: string]: ImageEntry };
      nativeImages?: ImageEntry[];
    } => {
      if (!images && !nativeAssetImages) {
        return {};
      }

      const imagesResult: {
        [key: string]: string | (ImageResolvedAssetSource & { sdf?: boolean });
      } = {};

      if (images) {
        Object.entries(images).forEach(([imageName, value]) => {
          if (typeof value === "string") {
            imagesResult[imageName] = value;
          } else if (
            typeof value === "object" &&
            "source" in value &&
            value.source
          ) {
            imagesResult[imageName] = {
              ...Image.resolveAssetSource(value.source),
              sdf: value.sdf,
            };
          } else {
            imagesResult[imageName] = Image.resolveAssetSource(value);
          }
        });
      }

      return imagesResult;
    };

    return {
      id,
      hasOnImageMissing: !!onImageMissing,
      onImageMissing: (
        event: NativeSyntheticEvent<{ payload: { imageKey: string } }>,
      ): void => {
        if (onImageMissing) {
          onImageMissing(event.nativeEvent.payload.imageKey);
        }
      },
      images: getImages(),
      nativeImages: nativeAssetImages ?? [],
    };
  }, [id, onImageMissing, images, nativeAssetImages]);

  return <MLRNImages {...props}>{children}</MLRNImages>;
};

const MLRNImages = requireNativeComponent(NATIVE_MODULE_NAME);
