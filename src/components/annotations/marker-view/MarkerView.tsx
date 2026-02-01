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

export interface MarkerViewProps extends ViewProps {
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
 * MarkerView allows you to place an interactive React Native View on the map.
 *
 * If you have static view consider using PointAnnotation or SymbolLayer for better performance.
 *
 * Implemented through:
 * - Android: [MakerView plugin](https://github.com/maplibre/maplibre-plugins-android/tree/main/plugin-markerview)
 * - iOS: [MLNPointAnnotation](https://maplibre.org/maplibre-native/ios/latest/documentation/maplibre/mlnpointannotation/)
 */
export const MarkerView = ({
  id,
  anchor = "center",
  offset,
  ...rest
}: MarkerViewProps) => {
  const nativeAnchor = anchorToNative(anchor);
  const nativeOffset = offset ? { x: offset[0], y: offset[1] } : undefined;
  const nativeRef = useRef<
    Component<ComponentProps<typeof MarkerViewNativeComponent>> &
      Readonly<NativeMethods>
  >(null);
  const pointAnnotationRef = useRef<PointAnnotationRef>(null);

  const idForPointAnnotation = useFrozenId(id);

  if (Platform.OS === "ios") {
    return (
      <PointAnnotation
        ref={pointAnnotationRef}
        id={idForPointAnnotation}
        anchor={anchor}
        offset={offset}
        {...rest}
      />
    );
  }

  return (
    <MarkerViewNativeComponent
      ref={nativeRef}
      anchor={nativeAnchor}
      offset={nativeOffset}
      {...rest}
    >
      <View
        // Prevent Fabric from collapsing the view hierarchy
        collapsable={false}
        style={{
          // Allow content to render outside the marker bounds
          overflow: "visible",
        }}
      >
        {rest.children}
      </View>
    </MarkerViewNativeComponent>
  );
};
