import BaseProps from '../types/BaseProps';

import ShapeSource from './ShapeSource';

import React, {ReactElement} from 'react';
import {
  requireNativeComponent,
  Image,
  NativeSyntheticEvent,
  ImageSourcePropType,
  ImageURISource,
} from 'react-native';

export const NATIVE_MODULE_NAME = 'RCTMLNImages';

export type ImageEntry = string | ImageSourcePropType;

function _isUrlOrPath(value: ImageEntry): boolean {
  return (
    (typeof value === 'string' || value instanceof String) &&
    (value.startsWith('file://') ||
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:') ||
      value.startsWith('asset://') ||
      value.startsWith('/'))
  );
}

function _isImageSourcePropType(
  value: ImageEntry,
): value is ImageSourcePropType {
  if (typeof value === 'number' || value instanceof Number) {
    return true;
  }
  const valueAsSource = value as ImageURISource;
  return !!valueAsSource.uri && typeof valueAsSource.uri === 'string';
}

interface ImagesProps extends BaseProps {
  /**
   * Specifies the external images in key-value pairs required for the shape source.
   * Keys are names - see iconImage expressions, values can be either urls-s objects
   * with format {uri: 'http://...'}` or `require('image.png')` or `import 'image.png'`
   */
  images?: {[key: string]: ImageEntry};
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
  children: ReactElement;
}

/**
 * Images defines the images used in Symbol etc layers
 */
class Images extends React.Component<ImagesProps> {
  static NATIVE_ASSETS_KEY = 'assets';

  _getImages(): {
    images?: {[key: string]: ImageEntry};
    nativeImages?: ImageEntry[];
  } {
    if (!this.props.images && !this.props.nativeAssetImages) {
      return {};
    }

    const images: {[key: string]: ImageEntry} = {};
    let nativeImages: ImageEntry[] = [];

    if (this.props.images) {
      const imageNames = Object.keys(this.props.images);
      for (const imageName of imageNames) {
        const value = this.props.images[imageName];
        if (
          imageName === ShapeSource.NATIVE_ASSETS_KEY &&
          Array.isArray(value)
        ) {
          console.warn(
            `Use of ${ShapeSource.NATIVE_ASSETS_KEY} in Images#images is deprecated please use Images#nativeAssetImages`,
          );
          nativeImages = value;
        } else if (_isUrlOrPath(value)) {
          images[imageName] = value;
        } else if (_isImageSourcePropType(value)) {
          const res = Image.resolveAssetSource(value);
          if (res && res.uri) {
            images[imageName] = res;
          }
        }
      }
    }

    if (this.props.nativeAssetImages) {
      nativeImages = this.props.nativeAssetImages;
    }

    return {
      images,
      nativeImages,
    };
  }

  _onImageMissing(
    event: NativeSyntheticEvent<{payload: {imageKey: string}}>,
  ): void {
    if (this.props.onImageMissing) {
      this.props.onImageMissing(event.nativeEvent.payload.imageKey);
    }
  }

  render(): ReactElement {
    const props = {
      id: this.props.id,
      hasOnImageMissing: !!this.props.onImageMissing,
      onImageMissing: this._onImageMissing.bind(this),
      ...this._getImages(),
    };

    return <RCTMLNImages {...props}>{this.props.children}</RCTMLNImages>;
  }
}

const RCTMLNImages = requireNativeComponent(NATIVE_MODULE_NAME);

export default Images;
