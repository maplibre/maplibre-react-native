import {
  cloneReactChildrenWithProps,
  isNumber,
  resolveImagePath,
} from '../utils';
import BaseProps from '../types/BaseProps';

import AbstractSource from './AbstractSource';

import {requireNativeComponent} from 'react-native';
import React, {ReactElement} from 'react';

export const NATIVE_MODULE_NAME = 'RCTMLNImageSource';

interface ImageSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id: string;
  /**
   * An HTTP(S) URL, absolute file URL, or local file URL to the source image.
   * Gifs are currently not supported.
   */
  url?: number | string;
  /**
   * The top left, top right, bottom right, and bottom left coordinates for the image.
   */
  coordinates?: [
    GeoJSON.Position,
    GeoJSON.Position,
    GeoJSON.Position,
    GeoJSON.Position,
  ];

  children?: ReactElement | ReactElement[];
}

type NativeProps = ImageSourceProps;

/**
 * ImageSource is a content source that is used for a georeferenced raster image to be shown on the map.
 * The georeferenced image scales and rotates as the user zooms and rotates the map
 */
class ImageSource extends AbstractSource<ImageSourceProps, NativeProps> {
  _getURL(): string | undefined {
    return isNumber(this.props.url)
      ? resolveImagePath(this.props.url)
      : this.props.url;
  }

  render(): ReactElement | null {
    if (
      !this.props.url ||
      !this.props.coordinates ||
      !this.props.coordinates.length
    ) {
      return null;
    }

    const props = {
      ...this.props,
      url: this._getURL(),
    };

    return (
      <RCTMLNImageSource ref={this.setNativeRef} {...props}>
        {cloneReactChildrenWithProps(this.props.children, {
          sourceID: this.props.id,
        })}
      </RCTMLNImageSource>
    );
  }
}

const RCTMLNImageSource =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default ImageSource;
