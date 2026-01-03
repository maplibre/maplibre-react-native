import type { LngLat } from "./LngLat";
import type { PixelPoint } from "./PixelPoint";

export interface PressEvent {
  /**
   * Geographic coordinates of the touch event
   */
  lngLat: LngLat;

  /**
   * Pixel point of the touch event within the elements' viewport
   */
  point: PixelPoint;
}
