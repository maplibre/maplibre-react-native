import { memo, type ReactNode } from "react";

import RasterSourceNativeComponent from "./RasterSourceNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import { cloneReactChildrenWithProps } from "../../../utils";

export interface RasterSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * A URL to a TileJSON configuration file describing the source's contents and other metadata.
   */
  url?: string;

  /**
   * An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.
   * @example "https://example.com/raster-tiles/{z}/{x}/{y}.png"
   */
  tiles?: string[];

  /**
   * An unsigned integer that specifies the minimum zoom level at which to display tiles from the source.
   * The value should be between 0 and 22, inclusive, and less than
   * maxzoom, if specified. The default value for this option is 0.
   */
  minzoom?: number;

  /**
   * An unsigned integer that specifies the maximum zoom level at which to display tiles from the source.
   * The value should be between 0 and 22, inclusive, and less than
   * minzoom, if specified. The default value for this option is 22.
   */
  maxzoom?: number;

  /**
   * Size of the map tiles.
   *
   * @default 512
   */
  tileSize?: number;

  /**
   * Influences the y direction of the tile coordinates. (tms inverts y-axis)
   *
   * @default "xyz"
   */
  scheme?: "xyz" | "tms";

  /**
   * An HTML or literal text string defining the buttons to be displayed in an action sheet when the
   * source is part of a map view's style and the map view's attribution button is pressed.
   */
  attribution?: string;

  children?: ReactNode;
}

/**
 * RasterSource is a map content source that supplies raster image tiles to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary
 * or by an external file that conforms to the TileJSON specification.
 */
export const RasterSource = memo(({ id, ...props }: RasterSourceProps) => {
  const frozenId = useFrozenId(id);

  return (
    <RasterSourceNativeComponent id={frozenId} {...props}>
      {cloneReactChildrenWithProps(props.children, {
        source: frozenId,
      })}
    </RasterSourceNativeComponent>
  );
});
