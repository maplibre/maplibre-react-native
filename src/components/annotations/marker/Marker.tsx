import {
  Component,
  type ComponentProps,
  type ReactElement,
  useRef,
} from "react";
import {
  type NativeMethods,
  Platform,
  View,
  type ViewProps,
} from "react-native";

import MarkerViewNativeComponent from "./MarkerViewNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type Anchor, anchorToNative } from "../../../types/Anchor";
import type { LngLat } from "../../../types/LngLat";
import type { PixelPoint } from "../../../types/PixelPoint";
import {
  PointAnnotation,
  type PointAnnotationRef,
} from "../point-annotation/PointAnnotation";

export interface MarkerProps extends ViewProps {
  /**
   * A string that uniquely identifies the marker.
   */
  id?: string;

  /**
   * The center point (specified as a map coordinate) of the marker.
   * See also #anchor.
   */
  lngLat: LngLat;

  /**
   * Specifies the anchor being set on a particular point of the annotation.
   * The anchor indicates which part of the marker should be placed closest to the coordinate.
   * Defaults to "center".
   *
   * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/
   */
  anchor?: Anchor;

  /**
   * The offset in pixels to apply relative to the anchor.
   * Negative values indicate left and up.
   *
   * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset
   */
  offset?: PixelPoint;

  /**
   * Manually selects/deselects the marker.
   *
   * @platform iOS
   */
  selected?: boolean;

  /**
   * Expects one child - can be container with multiple elements
   */
  children: ReactElement;
}

/**
 * Marker allows you to place an interactive React Native View on the map.
 *
 * If you have static view consider using PointAnnotation or SymbolLayer for better performance.
 *
 * Implemented through:
 * - Android: Native Views placed on the map projection
 * - iOS: [MLNPointAnnotation](https://maplibre.org/maplibre-native/ios/latest/documentation/maplibre/mlnpointannotation/)
 */
export const Marker = ({
  id,
  anchor = "center",
  offset,
  ...props
}: MarkerProps) => {
  const nativeRef = useRef<
    Component<ComponentProps<typeof MarkerViewNativeComponent>> &
      Readonly<NativeMethods>
  >(null);

  const nativeAnchor = anchorToNative(anchor);
  const nativeOffset = offset ? { x: offset[0], y: offset[1] } : undefined;

  const pointAnnotationRef = useRef<PointAnnotationRef>(null);
  const frozenId = useFrozenId(id);

  if (Platform.OS === "ios") {
    return (
      <PointAnnotation
        ref={pointAnnotationRef}
        id={frozenId}
        anchor={anchor}
        offset={offset}
        {...props}
      />
    );
  }

  return (
    <MarkerViewNativeComponent
      ref={nativeRef}
      id={frozenId}
      anchor={nativeAnchor}
      offset={nativeOffset}
      {...props}
      style={[
        { flex: 0, alignSelf: "flex-start", overflow: "visible" },
        props.style,
      ]}
    >
      <View
        collapsable={false}
        style={{ flex: 0, alignSelf: "flex-start", overflow: "visible" }}
      >
        {props.children}
      </View>
    </MarkerViewNativeComponent>
  );
};
