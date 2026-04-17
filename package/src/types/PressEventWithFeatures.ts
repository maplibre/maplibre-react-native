import type { PressEvent } from "./PressEvent";

/**
 * Press event data enriched with GeoJSON features at the pressed location.
 */
export interface PressEventWithFeatures extends PressEvent {
  features: GeoJSON.Feature[];
}
