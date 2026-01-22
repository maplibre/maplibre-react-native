import { memo, type ReactNode } from "react";

import ImageSourceNativeComponent from "./ImageSourceNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import type { LngLat } from "../../../types/LngLat";
import {
  cloneReactChildrenWithProps,
  isNumber,
  resolveImagePath,
} from "../../../utils";

export interface ImageSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * An HTTP(S) URL, absolute file URL, or local file URL to the source image.
   * Animated GIFs are not supported.
   */
  url: string | number;

  /**
   * The top left, top right, bottom right, and bottom left coordinates for the image.
   */
  coordinates: [
    topLeft: LngLat,
    topRight: LngLat,
    bottomRight: LngLat,
    bottomLeft: LngLat,
  ];

  children?: ReactNode;
}

/**
 * ImageSource is a content source that is used for a georeferenced raster image to be shown on the map.
 * The georeferenced image scales and rotates as the user zooms and rotates the map
 */
export const ImageSource = memo(({ id, url, ...props }: ImageSourceProps) => {
  const frozenId = useFrozenId(id);

  return (
    <ImageSourceNativeComponent
      id={frozenId}
      url={isNumber(url) ? resolveImagePath(url) : url}
      coordinates={props.coordinates}
    >
      {cloneReactChildrenWithProps(props.children, {
        sourceID: frozenId,
      })}
    </ImageSourceNativeComponent>
  );
});
