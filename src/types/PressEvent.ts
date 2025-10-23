export interface PressEvent {
  longitude: number;

  latitude: number;

  /**
   * Touch origin X coordinate inside touchable area (relative to the element).
   */
  locationX: number;

  /**
   * Touch origin Y coordinate inside touchable area (relative to the element).
   */
  locationY: number;
}

export interface PressEventWithFeatures extends PressEvent {
  features: GeoJSON.Feature[];
}
