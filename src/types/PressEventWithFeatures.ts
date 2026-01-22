import type { PressEvent } from "./PressEvent";

export interface PressEventWithFeatures extends PressEvent {
  features: GeoJSON.Feature[];
}
