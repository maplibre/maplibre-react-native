import React, {ReactElement} from 'react';
import {requireNativeComponent} from 'react-native';

import useAbstractSource from '../hooks/useAbstractSource';
import BaseProps from '../types/BaseProps';
import {
  cloneReactChildrenWithProps,
  isNumber,
  resolveImagePath,
} from '../utils';

export const NATIVE_MODULE_NAME = 'RCTMLNImageSource';

export interface ImageSourceProps extends BaseProps {
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

const RCTMLNImageSource =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * ImageSource is a content source that is used for a georeferenced raster image to be shown on the map.
 * The georeferenced image scales and rotates as the user zooms and rotates the map
 */
const ImageSource: React.FC<ImageSourceProps> = (props: ImageSourceProps) => {
  const {setNativeRef} = useAbstractSource<NativeProps>();

  const _getURL = (): string | undefined => {
    return isNumber(props.url) ? resolveImagePath(props.url) : props.url;
  };

  if (!props.url || !props.coordinates || !props.coordinates.length) {
    return null;
  }

  const allProps = {
    ...props,
    url: _getURL(),
  };

  return (
    <RCTMLNImageSource ref={setNativeRef} {...allProps}>
      {cloneReactChildrenWithProps(allProps.children, {
        sourceID: allProps.id,
      })}
    </RCTMLNImageSource>
  );
};

export default ImageSource;
