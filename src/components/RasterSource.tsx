import { type ReactNode } from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import { useAbstractSource } from "../hooks/useAbstractSource";
import { useOnce } from "../hooks/useOnce";
import { type BaseProps } from "../types/BaseProps";
import { cloneReactChildrenWithProps } from "../utils";

const MLRNModule = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNRasterSource";

const isTileTemplateUrl = (url?: string): url is string =>
  !!url &&
  (url.includes("{z}") || url.includes("{bbox-") || url.includes("{quadkey}"));

interface RasterSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id: string;
  /**
   * A URL to a TileJSON configuration file describing the source’s contents and other metadata.
   */
  url?: string;
  /**
   * An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.
   * Example: https://example.com/raster-tiles/{z}/{x}/{y}.png
   */
  tileUrlTemplates?: string[];
  /**
   * An unsigned integer that specifies the minimum zoom level at which to display tiles from the source.
   * The value should be between 0 and 22, inclusive, and less than
   * maxZoomLevel, if specified. The default value for this option is 0.
   */
  minZoomLevel?: number;
  /**
   * An unsigned integer that specifies the maximum zoom level at which to display tiles from the source.
   * The value should be between 0 and 22, inclusive, and less than
   * minZoomLevel, if specified. The default value for this option is 22.
   */
  maxZoomLevel?: number;
  /**
   * Size of the map tiles.
   * Mapbox urls default to 256, all others default to 512.
   */
  tileSize?: number;
  /**
   * Influences the y direction of the tile coordinates. (tms inverts y axis)
   */
  tms?: boolean;
  /**
   * An HTML or literal text string defining the buttons to be displayed in an action sheet when the
   * source is part of a map view’s style and the map view’s attribution button is pressed.
   */
  attribution?: string;

  children?: ReactNode;
}

type NativeProps = RasterSourceProps;

const MLRNRasterSource =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * RasterSource is a map content source that supplies raster image tiles to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary
 * or by an external file that conforms to the TileJSON specification.
 */
export const RasterSource = ({
  id = MLRNModule.StyleSource.DefaultSourceID,
  ...props
}: RasterSourceProps) => {
  useOnce(() => {
    if (props.url && props.tileUrlTemplates) {
      console.warn(
        `RasterSource 'url' property contains a Tile URL Template, but is intended for a StyleJSON URL. Please migrate your VectorSource to use: \`tileUrlTemplates=["${props.url}"]\` instead.`,
      );
    }
  });

  const { setNativeRef } = useAbstractSource<NativeProps>();

  let { url, tileUrlTemplates } = props;

  // Swapping url for tileUrlTemplates to provide backward compatiblity
  // when RasterSource supported only tile url as url prop
  if (isTileTemplateUrl(url)) {
    tileUrlTemplates = [url];
    url = undefined;
  }
  const allProps = {
    ...props,
    id,
    url,
    tileUrlTemplates,
    minZoomLevel: props.minZoomLevel,
    maxZoomLevel: props.maxZoomLevel,
    tileSize: props.tileSize,
    tms: props.tms,
    attribution: props.attribution,
  };

  return (
    <MLRNRasterSource ref={setNativeRef} {...allProps}>
      {cloneReactChildrenWithProps(props.children, {
        sourceID: id,
      })}
    </MLRNRasterSource>
  );
};
