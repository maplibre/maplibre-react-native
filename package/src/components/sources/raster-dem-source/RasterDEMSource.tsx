import { memo, type ReactNode } from "react";

import RasterDEMSourceNativeComponent from "./RasterDEMSourceNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import { cloneReactChildrenWithProps } from "../../../utils";

export interface RasterDEMSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * A URL to a TileJSON configuration file describing the source's contents and
   * other metadata.
   */
  url?: string;

  /**
   * An array of tile URL templates. If multiple endpoints are specified, clients
   * may use any combination of endpoints.
   *
   * @example "https://example.com/dem-tiles/{z}/{x}/{y}.png"
   */
  tiles?: string[];

  /**
   * An unsigned integer that specifies the minimum zoom level at which to display
   * tiles from the source. The value should be between 0 and 22, inclusive, and
   * less than maxzoom, if specified. The default value for this option is 0.
   */
  minzoom?: number;

  /**
   * An unsigned integer that specifies the maximum zoom level at which to display
   * tiles from the source. The value should be between 0 and 22, inclusive, and
   * greater than minzoom, if specified. The default value for this option is 22.
   */
  maxzoom?: number;

  /**
   * Size of the map tiles.
   *
   * @defaultValue 512
   */
  tileSize?: number;

  /**
   * An HTML or literal text string defining the buttons to be displayed in an
   * action sheet when the source is part of a map view's style and the map view's
   * attribution button is pressed.
   */
  attribution?: string;

  /**
   * The encoding formula for the raster DEM tileset.
   *
   * @defaultValue "mapbox"
   */
  encoding?: "mapbox" | "terrarium";

  children?: ReactNode;
}

/**
 * RasterDEMSource is a map content source that supplies rasterized digital
 * elevation model (DEM) tiles to be shown on the map. Use it together with a
 * hillshade layer to visualize terrain.
 */
export const RasterDEMSource = memo(
  ({ id, ...props }: RasterDEMSourceProps) => {
    const frozenId = useFrozenId(id);

    return (
      <RasterDEMSourceNativeComponent id={frozenId} {...props}>
        {cloneReactChildrenWithProps(props.children, {
          source: frozenId,
        })}
      </RasterDEMSourceNativeComponent>
    );
  },
);
