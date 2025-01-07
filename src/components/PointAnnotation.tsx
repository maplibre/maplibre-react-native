import { point } from "@turf/helpers";
import {
  Component,
  type SyntheticEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from "react";
import {
  Platform,
  StyleSheet,
  type ViewProps,
  requireNativeComponent,
} from "react-native";

import { useNativeBridge, type RNMLEvent } from "../hooks/useNativeBridge";
import { isFunction, toJSONString } from "../utils";

export const NATIVE_MODULE_NAME = "MLRNPointAnnotation";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});

type FeaturePayload = GeoJSON.Feature<
  GeoJSON.Point,
  {
    screenPointX: number;
    screenPointY: number;
  }
>;

export interface PointAnnotationProps {
  /**
   * A string that uniquely identifies the annotation
   */
  id: string;
  /**
   * The string containing the annotation’s title. Note this is required to be set if you want to see a callout appear on iOS.
   */
  title?: string;
  /**
   * The string containing the annotation’s snippet(subtitle). Not displayed in the default callout.
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
  coordinate: number[];
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
   * This callback is fired once this annotation is selected. Returns a Feature as the first param.
   */
  onSelected?(payload: FeaturePayload): void;
  /**
   * This callback is fired once this annotation is deselected.
   */
  onDeselected?(payload: FeaturePayload): void;
  /**
   * This callback is fired once this annotation has started being dragged.
   */
  onDragStart?(payload: FeaturePayload): void;
  /**
   * This callback is fired once this annotation has stopped being dragged.
   */
  onDragEnd?(payload: FeaturePayload): void;
  /**
   * This callback is fired while this annotation is being dragged.
   */
  onDrag?(payload: FeaturePayload): void;

  /**
   * Expects one child, and an optional callout can be added as well
   */
  children: ReactElement | [ReactElement, ReactElement];

  style?: ViewProps["style"];
}

interface NativeProps extends Omit<PointAnnotationProps, "coordinate"> {
  coordinate?: string;
}

export interface PointAnnotationRef {
  refresh(): void;
}

/**
 * PointAnnotation represents a one-dimensional shape located at a single geographical coordinate.
 *
 * Consider using ShapeSource and SymbolLayer instead, if you have many points, and you have static images,
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
    useImperativeHandle(
      ref,
      (): PointAnnotationRef => ({
        /**
         * On android point annotation is rendered offscreen with a canvas into an image.
         * To rerender the image from the current state of the view call refresh.
         * Call this for example from Image#onLoad.
         */
        refresh,
      }),
    );

    const { _runNativeCommand, _runPendingNativeCommands } =
      useNativeBridge(NATIVE_MODULE_NAME);
    const _nativeRef = useRef<Component<NativeProps> | null>();

    function refresh(): void {
      if (Platform.OS === "android") {
        _runNativeCommand("refresh", _nativeRef.current, []);
      }
    }

    function _onSelected(
      e: SyntheticEvent<Element, RNMLEvent<FeaturePayload>>,
    ): void {
      if (isFunction(props.onSelected)) {
        props.onSelected(e.nativeEvent.payload);
      }
    }

    function _onDeselected(
      e: SyntheticEvent<Element, RNMLEvent<FeaturePayload>>,
    ): void {
      if (isFunction(props.onDeselected)) {
        props.onDeselected(e.nativeEvent.payload);
      }
    }

    function _onDragStart(
      e: SyntheticEvent<Element, RNMLEvent<FeaturePayload>>,
    ): void {
      if (isFunction(props.onDragStart)) {
        props.onDragStart(e.nativeEvent.payload);
      }
    }

    function _onDrag(
      e: SyntheticEvent<Element, RNMLEvent<FeaturePayload>>,
    ): void {
      if (isFunction(props.onDrag)) {
        props.onDrag(e.nativeEvent.payload);
      }
    }

    function _onDragEnd(
      e: SyntheticEvent<Element, RNMLEvent<FeaturePayload>>,
    ): void {
      if (isFunction(props.onDragEnd)) {
        props.onDragEnd(e.nativeEvent.payload);
      }
    }

    function _getCoordinate(): string | undefined {
      if (!props.coordinate) {
        return undefined;
      }
      return toJSONString(point(props.coordinate));
    }

    const _setNativeRef = (nativeRef: Component<NativeProps> | null): void => {
      _nativeRef.current = nativeRef;
      _runPendingNativeCommands(nativeRef);
    };

    const nativeProps = {
      ...props,
      anchor,
      draggable,
      ref: (nativeRef: Component<NativeProps> | null) =>
        _setNativeRef(nativeRef),
      id: props.id,
      title: props.title,
      snippet: props.snippet,
      selected: props.selected,
      style: [props.style, styles.container],
      onMapboxPointAnnotationSelected: _onSelected,
      onMapboxPointAnnotationDeselected: _onDeselected,
      onMapboxPointAnnotationDragStart: _onDragStart,
      onMapboxPointAnnotationDrag: _onDrag,
      onMapboxPointAnnotationDragEnd: _onDragEnd,
      coordinate: _getCoordinate(),
    };

    return (
      <MLRNPointAnnotation {...nativeProps}>
        {props.children}
      </MLRNPointAnnotation>
    );
  },
);

// eslint complains about it
// not sure why only in this component
PointAnnotation.displayName = "PointAnnotation";

const MLRNPointAnnotation =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
