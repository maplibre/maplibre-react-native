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
import type { LngLat } from "../../types/LngLat";

export interface MarkerViewRef {
  /**
   * On android point annotation is rendered offscreen with a canvas into an image.
   * To rerender the image from the current state of the view call refresh.
   * Call this for example from Image#onLoad.
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
   * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],
   * where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.
   * Note this is only for custom annotations not the default pin view.
   * Defaults to the center of the view.
   */
  anchor?: {
    /**
     * `x` of anchor
     */
    x: number;
    /**
     * `y` of anchor
     */
    y: number;
  };

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
      anchor = { x: 0.5, y: 0.5 },
      allowOverlap = false,
      isSelected = false,
      ...rest
    },
    ref,
  ) => {
    const props = { anchor, allowOverlap, isSelected, ...rest };
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
          {...props}
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
      <MarkerViewNativeComponent ref={nativeRef} {...props}>
        <View collapsable={false} style={{ overflow: "visible" }}>
          {props.children}
        </View>
      </MarkerViewNativeComponent>
    );
  },
);

MarkerView.displayName = "MarkerView";
