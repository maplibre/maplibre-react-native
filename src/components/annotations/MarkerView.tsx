import {
  Component,
  type ComponentProps,
  forwardRef,
  type ReactElement,
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
import { PointAnnotation, type PointAnnotationRef } from "./PointAnnotation";
import { useFrozenId } from "../../hooks/useFrozenId";
import { type Anchor, anchorToNative } from "../../types/Anchor";
import type { LngLat } from "../../types/LngLat";
import type { PixelPoint } from "../../types/PixelPoint";

export interface MarkerViewRef {
  /**
   * Refreshes the annotation view.
   * On iOS, delegates to PointAnnotation's refresh method.
   * On Android, this is a no-op since MarkerView uses live views (not bitmaps).
   */
  refresh(): void;
}

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

  allowOverlap?: boolean;

  isSelected?: boolean;

  /**
   * Expects one child - can be container with multiple elements
   */
  children: ReactElement;
}

/**
 * MarkerView allows you to place an interactive React Native View on the map.
 *
 * If you have static view consider using PointAnnotation or SymbolLayer they'll offer much better performance.
 *
 * This is based on [MakerView plugin](https://github.com/maplibre/maplibre-plugins-android/tree/main/plugin-markerview) on Android
 * and PointAnnotation on iOS.
 */
export const MarkerView = forwardRef<MarkerViewRef, MarkerViewProps>(
  (
    {
      id,
      anchor = "center",
      offset,
      allowOverlap = false,
      isSelected = false,
      ...rest
    },
    ref,
  ) => {
    const nativeAnchor = anchorToNative(anchor);
    const nativeOffset = offset ? { x: offset[0], y: offset[1] } : undefined;
    const nativeRef = useRef<
      Component<ComponentProps<typeof MarkerViewNativeComponent>> &
        Readonly<NativeMethods>
    >(null);
    const pointAnnotationRef = useRef<PointAnnotationRef>(null);

    const idForPointAnnotation = useFrozenId(id);

    // Expose refresh method through ref (delegates to PointAnnotation on iOS)
    useImperativeHandle(
      ref,
      (): MarkerViewRef => ({
        refresh: () => {
          if (Platform.OS === "ios") {
            pointAnnotationRef.current?.refresh();
          }
          // On Android, MarkerView doesn't need refresh as it uses live views
        },
      }),
    );

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

    // On Android, wrap children in a non-collapsable View to prevent Fabric
    // from flattening the view hierarchy. Without this, Fabric may flatten
    // intermediate Views (like TouchableOpacity containers), causing their
    // backgrounds to disappear and breaking the visual structure.
    // The wrapper needs overflow: 'visible' to allow content (like callouts)
    // to render outside the marker bounds.
    return (
      <MarkerViewNativeComponent
        ref={nativeRef}
        anchor={nativeAnchor}
        offset={nativeOffset}
        allowOverlap={allowOverlap}
        isSelected={isSelected}
        {...rest}
      >
        <View collapsable={false} style={{ overflow: "visible" }}>
          {rest.children}
        </View>
      </MarkerViewNativeComponent>
    );
  },
);
