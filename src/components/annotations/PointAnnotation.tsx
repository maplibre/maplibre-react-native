import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from "react";
import {
  Platform,
  StyleSheet,
  type ViewProps,
  type NativeSyntheticEvent,
} from "react-native";

import PointAnnotationNativeComponent, {
  Commands,
} from "./PointAnnotationNativeComponent";
import type { LngLat } from "../../types/LngLat";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});

export type AnnotationEvent = {
  id: string;
  lngLat: LngLat;
  point: [x: number, y: number];
};

export interface PointAnnotationProps {
  /**
   * A string that uniquely identifies the annotation
   */
  id: string;
  /**
   * The string containing the annotation's title. Note this is required to be set if you want to see a callout appear on iOS.
   */
  title?: string;
  /**
   * The string containing the annotation's snippet(subtitle). Not displayed in the default callout.
   */
  snippet?: string;
  /**
   * Manually selects/deselects annotation
   */
  selected?: boolean;
  /**
   * Enable or disable dragging. Defaults to false.
   */
  draggable?: boolean;
  /**
   * The center point (specified as a map coordinate) of the annotation.
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
     * See anchor
     */
    x: number;
    /**
     * See anchor
     */
    y: number;
  };
  /**
   * This callback is fired once this annotation is selected.
   */
  onSelected?: (event: NativeSyntheticEvent<AnnotationEvent>) => void;
  /**
   * This callback is fired once this annotation is deselected.
   */
  onDeselected?: (event: NativeSyntheticEvent<AnnotationEvent>) => void;
  /**
   * This callback is fired once this annotation has started being dragged.
   */
  onDragStart?: (event: NativeSyntheticEvent<AnnotationEvent>) => void;
  /**
   * This callback is fired once this annotation has stopped being dragged.
   */
  onDragEnd?: (event: NativeSyntheticEvent<AnnotationEvent>) => void;
  /**
   * This callback is fired while this annotation is being dragged.
   */
  onDrag?: (event: NativeSyntheticEvent<AnnotationEvent>) => void;

  /**
   * Expects one child, and an optional callout can be added as well
   */
  children: ReactElement | [ReactElement, ReactElement];

  style?: ViewProps["style"];
}

export interface PointAnnotationRef {
  /**
   * On android point annotation is rendered offscreen with a canvas into an image.
   * To rerender the image from the current state of the view call refresh.
   * Call this for example from Image#onLoad.
   */
  refresh(): void;
}

/**
 * PointAnnotation represents a one-dimensional shape located at a single geographical coordinate.
 *
 * Consider using GeoJSONSource and SymbolLayer instead, if you have many points, and you have static images,
 * they'll offer much better performance.
 *
 * If you need interactive views please use MarkerView,
 * as with PointAnnotation on Android child views are rendered onto a bitmap for better performance.
 */
export const PointAnnotation = forwardRef<
  PointAnnotationRef,
  PointAnnotationProps
>(
  (
    {
      anchor = { x: 0.5, y: 0.5 },
      draggable = false,
      ...props
    }: PointAnnotationProps,
    ref,
  ) => {
    const nativeRef =
      useRef<React.ElementRef<typeof PointAnnotationNativeComponent>>(null);

    useImperativeHandle(
      ref,
      (): PointAnnotationRef => ({
        refresh,
      }),
    );

    function refresh(): void {
      if (Platform.OS === "android" && nativeRef.current) {
        Commands.refresh(nativeRef.current);
      }
    }

    return (
      <PointAnnotationNativeComponent
        ref={nativeRef}
        {...props}
        anchor={anchor}
        draggable={draggable}
        style={[props.style, styles.container]}
      >
        {props.children}
      </PointAnnotationNativeComponent>
    );
  },
);

PointAnnotation.displayName = "PointAnnotation";
