import {
  Component,
  type ComponentProps,
  type ReactElement,
  type Ref,
  useImperativeHandle,
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
  type NativeViewAnnotationRef,
  ViewAnnotation,
  type ViewAnnotationRef,
} from "../view-annotation/ViewAnnotation";

export type NativeMarkerRef = Component<
  ComponentProps<typeof MarkerViewNativeComponent>
> &
  Readonly<NativeMethods>;

export interface MarkerRef {
  /**
   * Returns a reference to the native component for Reanimated compatibility.
   * This method is used by Reanimated's createAnimatedComponent to determine
   * which component should receive animated props.
   *
   * @see https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent/#component
   */
  getAnimatableRef(): NativeMarkerRef | NativeViewAnnotationRef | null;
}

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
   * Expects one child - can be a View with multiple elements.
   */
  children: ReactElement;

  /**
   * Ref to access Marker methods.
   */
  ref?: Ref<MarkerRef>;
}

/**
 * Marker allows you to place an interactive React Native View on the map.
 *
 * If you have static view consider using ViewAnnotation or SymbolLayer for better performance.
 *
 * Implemented through:
 * - Android: Native Views placed on the map projection
 * - iOS: [MLNPointAnnotation](https://maplibre.org/maplibre-native/ios/latest/documentation/maplibre/mlnpointannotation/)
 */
export const Marker = ({
  id,
  anchor = "center",
  offset,
  ref,
  ...props
}: MarkerProps) => {
  const nativeRef = useRef<NativeMarkerRef>(null);
  const viewAnnotationRef = useRef<ViewAnnotationRef>(null);

  const nativeAnchor = anchorToNative(anchor);
  const nativeOffset = offset ? { x: offset[0], y: offset[1] } : undefined;

  const frozenId = useFrozenId(id);

  useImperativeHandle(
    ref,
    (): MarkerRef => ({
      getAnimatableRef: () =>
        Platform.OS === "ios"
          ? (viewAnnotationRef.current?.getAnimatableRef() ?? null)
          : nativeRef.current,
    }),
  );

  if (Platform.OS === "ios") {
    return (
      <ViewAnnotation
        ref={viewAnnotationRef}
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
