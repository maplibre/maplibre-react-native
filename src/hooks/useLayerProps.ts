import { type Component, type RefObject, useMemo, useRef } from "react";
import { type NativeMethods } from "react-native";

import { type BaseProps } from "../types/BaseProps";
import {
  type AllLayerStyle,
  type FilterExpression,
} from "../types/MapLibreRNStyles";
import { type StyleValue, transformStyle } from "../utils/StyleValue";
import { getFilter } from "../utils/getFilter";

export interface BaseLayerProps extends BaseProps {
  /**
   * A string that uniquely identifies the source in the style to which it is added.
   */
  id: string;

  /**
   * The source from which to obtain the data to style.
   * If the source has not yet been added to the current style, the behavior is undefined.
   * Inferred from parent source only if the layer is a direct child to it.
   */
  sourceID?: string;

  /**
   * Identifier of the layer within the source identified by the sourceID property from which the receiver obtains the data to style.
   */
  sourceLayerID?: string;

  /**
   * Inserts a layer above aboveLayerID.
   */
  aboveLayerID?: string;

  /**
   * Inserts a layer below belowLayerID
   */
  belowLayerID?: string;

  /**
   * Inserts a layer at a specified index
   */
  layerIndex?: number;

  /**
   * The minimum zoom level at which the layer gets parsed and appears.
   */
  minZoomLevel?: number;
  /**
   * The maximum zoom level at which the layer gets parsed and appears.
   */
  maxZoomLevel?: number;

  /**
   *  Filter only the features in the source layer that satisfy a condition that you define
   */
  filter?: FilterExpression;

  /**
   * Customizable style attributes
   */
  style?: AllLayerStyle;
}

export interface NativeBaseLayerProps {
  reactStyle?: { [key: string]: StyleValue };
}

export function useLayerProps<
  Props extends BaseLayerProps,
  NativeProps extends NativeBaseLayerProps,
>(
  props: Props,
): {
  nativeRef: RefObject<
    | (Component<NativeProps, Record<string, never>, any> &
        Readonly<NativeMethods>)
    | null
  >;
  nativeProps: Props;
} {
  const nativeRef = useRef<
    (Component<NativeProps> & Readonly<NativeMethods>) | null
  >(null);

  const nativeProps = useMemo(() => {
    return {
      ...props,
      style: undefined,
      filter: getFilter(props.filter),
      reactStyle: transformStyle(props.style),
    };
  }, [props]);

  return {
    nativeRef,
    nativeProps,
  };
}
