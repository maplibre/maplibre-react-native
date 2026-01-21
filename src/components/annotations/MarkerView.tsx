import { type ReactElement, useMemo } from "react";
import { Platform, type ViewProps } from "react-native";

import MarkerViewNativeComponent from "./MarkerViewNativeComponent";
import { PointAnnotation } from "./PointAnnotation";
import type { LngLat } from "../../types/LngLat";

export const NATIVE_MODULE_NAME = "MLRNMarkerView";

export interface MarkerViewProps extends ViewProps {
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
 * MarkerView allows you to place a interactive react native marker to the map.
 *
 * If you have static view consider using PointAnnotation or SymbolLayer they'll offer much better performance.
 *
 * This is based on [MakerView plugin](https://github.com/maplibre/maplibre-plugins-android/tree/main/plugin-markerview) on Android
 * and PointAnnotation on iOS.
 */
export const MarkerView = ({
  anchor = { x: 0.5, y: 0.5 },
  allowOverlap = false,
  isSelected = false,
  ...rest
}: MarkerViewProps) => {
  const props = { anchor, allowOverlap, isSelected, ...rest };

  const idForPointAnnotation = useMemo(() => {
    lastId = lastId + 1;
    return `MV-${lastId}`;
  }, []);

  if (Platform.OS === "ios") {
    return <PointAnnotation id={idForPointAnnotation} {...props} />;
  }

  return (
    <MarkerViewNativeComponent {...props}>
      {props.children}
    </MarkerViewNativeComponent>
  );
};

let lastId = 0;
