import {
  Children,
  Component,
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type Ref,
  useImperativeHandle,
  useRef,
} from "react";
import {
  type NativeSyntheticEvent,
  Platform,
  type ReactNativeElement,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import PointAnnotationNativeComponent, {
  Commands,
} from "./PointAnnotationNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type Anchor, anchorToNative } from "../../../types/Anchor";
import type { LngLat } from "../../../types/LngLat";
import type { PixelPoint } from "../../../types/PixelPoint";
import type { PressEvent } from "../../../types/PressEvent";
import { Callout } from "../callout/Callout";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});

export type NativeViewAnnotationRef = Component<
  ComponentProps<typeof PointAnnotationNativeComponent>
> &
  ReactNativeElement;

/**
 * Event emitted by a ViewAnnotation on press.
 */
export type ViewAnnotationEvent = PressEvent & {
  id: string;
};

export interface ViewAnnotationProps {
  /**
   * A string that uniquely identifies the annotation. If not provided, a unique
   * ID will be generated automatically.
   */
  id?: string;

  /**
   * The string containing the annotation's title. Note this is required to be set
   * if you want to see a callout appear on iOS.
   */
  title?: string;

  /**
   * The string containing the annotation's snippet(subtitle). Not displayed in
   * the default callout.
   */
  snippet?: string;

  /**
   * Manually selects/deselects annotation
   */
  selected?: boolean;

  /**
   * Enable or disable dragging.
   *
   * @defaultValue false
   */
  draggable?: boolean;

  /**
   * The center point (specified as a map coordinate) of the annotation.
   */
  lngLat: LngLat;

  /**
   * Specifies the anchor being set on a particular point of the annotation. The
   * anchor indicates which part of the marker should be placed closest to the
   * coordinate.
   *
   * @see {@link https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/}
   * @defaultValue "center"
   */
  anchor?: Anchor;

  /**
   * The offset in pixels to apply relative to the anchor. Negative values
   * indicate left and up.
   *
   * @see {@link https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset}
   * @defaultValue [0, 0]
   */
  offset?: PixelPoint;

  /**
   * This callback is fired when the annotation is pressed.
   */
  onPress?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  /**
   * This callback is fired once this annotation is selected.
   */
  onSelect?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  /**
   * This callback is fired once this annotation is deselected.
   */
  onDeselect?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  /**
   * This callback is fired once this annotation has started being dragged.
   */
  onDragStart?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  /**
   * This callback is fired once this annotation has stopped being dragged.
   */
  onDragEnd?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  /**
   * This callback is fired while this annotation is being dragged.
   */
  onDrag?: (event: NativeSyntheticEvent<ViewAnnotationEvent>) => void;

  style?: ViewProps["style"];

  /**
   * Expects one child, and an optional callout can be added as well
   */
  children: ReactElement | [ReactElement, ReactElement];

  /**
   * Ref to access ViewAnnotation methods.
   */
  ref?: Ref<ViewAnnotationRef>;
}

export interface ViewAnnotationRef {
  /**
   * On android point annotation is rendered offscreen with a canvas into an
   * image. To rerender the image from the current state of the view call refresh.
   * Call this for example from Image#onLoad.
   */
  refresh(): void;
  /**
   * Returns the native ref for Reanimated v4 compatibility. Uses a Proxy to map
   * _viewConfig to __viewConfig.
   */
  getAnimatableRef(): NativeViewAnnotationRef | null;
}

/**
 * ViewAnnotation represents a one-dimensional shape located at a single
 * geographical coordinate.
 *
 * Consider using GeoJSONSource and SymbolLayer instead, if you have many
 * points, and you have static images, they'll offer much better performance.
 *
 * If you need interactive views please use Marker, as with ViewAnnotation on
 * Android child views are rendered onto a bitmap for better performance.
 */
export const ViewAnnotation = ({
  id,
  anchor = "center",
  draggable = false,
  offset,
  ref,
  ...props
}: ViewAnnotationProps) => {
  const frozenId = useFrozenId(id);
  const nativeAnchor = anchorToNative(anchor);
  const nativeOffset = offset ? { x: offset[0], y: offset[1] } : undefined;
  const nativeRef = useRef<NativeViewAnnotationRef>(null);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (Platform.OS === "android" && nativeRef.current) {
        Commands.refresh(nativeRef.current);
      }
    },
    // Reanimated v4 compatibility: createAnimatedComponent looks for _viewConfig but native has __viewConfig
    getAnimatableRef: () =>
      nativeRef.current
        ? new Proxy(nativeRef.current, {
            get: (target, prop) =>
              prop === "_viewConfig"
                ? (target as unknown as { __viewConfig: unknown }).__viewConfig
                : target[prop as keyof typeof target],
          })
        : null,
  }));

  const wrappedChildren = (() => {
    if (Platform.OS !== "android") {
      return props.children;
    }

    // Separate Callout from other children so native can identify it
    const childArray = Children.toArray(props.children);
    const callout = childArray.find(
      (child) => isValidElement(child) && child.type === Callout,
    );
    const otherChildren = childArray.filter(
      (child) => !isValidElement(child) || child.type !== Callout,
    );

    return (
      <>
        <View collapsable={false} style={{ overflow: "visible" }}>
          {otherChildren}
        </View>
        {callout}
      </>
    );
  })();

  return (
    <PointAnnotationNativeComponent
      ref={nativeRef}
      {...props}
      id={frozenId}
      anchor={nativeAnchor}
      offset={nativeOffset}
      draggable={draggable}
      style={[props.style, styles.container]}
    >
      {wrappedChildren}
    </PointAnnotationNativeComponent>
  );
};
