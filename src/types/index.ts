import { type SyntheticEvent } from "react";

// TODO RENAME
export type MaplibreGLEvent<
  T extends string,
  P = GeoJSON.Feature,
  V = Element,
> = SyntheticEvent<V, { type: T; payload: P }>;

export enum StyleURL {
  Default = "https://demotiles.maplibre.org/style.json",
}
