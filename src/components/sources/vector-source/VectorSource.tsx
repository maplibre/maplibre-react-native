import {
  Component,
  type ComponentProps,
  forwardRef,
  memo,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { type NativeMethods } from "react-native";

import NativeVectorSourceModule from "./NativeVectorSourceModule";
import VectorSourceNativeComponent from "./VectorSourceNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import { type FilterExpression } from "../../../types/MapLibreRNStyles";
import type { PressableSourceProps } from "../../../types/sources/PressableSourceProps";
import { cloneReactChildrenWithProps } from "../../../utils";
import { findNodeHandle } from "../../../utils/findNodeHandle";
import { getFilter } from "../../../utils/getFilter";

export interface VectorSourceRef {
  /**
   * Returns all features that match the query parameters regardless of whether or not the feature is
   * currently rendered on the map. The domain of the query includes all currently-loaded vector tiles
   * and GeoJSON source tiles. This function does not check tiles outside of the visible viewport.
   *
   * @example
   * vectorSource.features(['id1', 'id2'])
   *
   * @param  options.sourceLayer - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
   * @param  options.filter - an optional filter statement to filter the returned Features.
   */
  querySourceFeatures(options: {
    sourceLayer: string;
    filter?: FilterExpression;
  }): Promise<GeoJSON.Feature[]>;
}

export interface VectorSourceProps extends BaseProps, PressableSourceProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * A URL to a TileJSON configuration file describing the source’s contents and other metadata.
   */
  url?: string;

  /**
   * An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.
   * Example: https://example.com/vector-tiles/{z}/{x}/{y}.pbf
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
   * Influences the y direction of the tile coordinates. (tms inverts y-axis)
   *
   * @default "xyz"
   */
  scheme?: "xyz" | "tms";

  /**
   * An HTML or literal text string defining the buttons to be displayed in an action sheet when the
   * source is part of a map view’s style and the map view’s attribution button is pressed.
   */
  attribution?: string;

  children?: ReactNode;
}

/**
 * VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.
 */
export const VectorSource = memo(
  forwardRef<VectorSourceRef, VectorSourceProps>(({ id, ...props }, ref) => {
    const nativeRef = useRef<
      Component<ComponentProps<typeof VectorSourceNativeComponent>> &
        Readonly<NativeMethods>
    >(null);

    const frozenId = useFrozenId(id);

    useImperativeHandle(ref, () => ({
      querySourceFeatures: async ({
        sourceLayer,
        filter,
      }: {
        sourceLayer: string;
        filter?: FilterExpression;
      }): Promise<GeoJSON.Feature[]> => {
        return NativeVectorSourceModule.querySourceFeatures(
          findNodeHandle(nativeRef.current),
          sourceLayer,
          getFilter(filter),
        );
      },
    }));

    return (
      <VectorSourceNativeComponent
        ref={nativeRef}
        id={frozenId}
        hasOnPress={!!props.onPress}
        {...props}
      >
        {cloneReactChildrenWithProps(props.children, {
          sourceID: frozenId,
        })}
      </VectorSourceNativeComponent>
    );
  }),
);
