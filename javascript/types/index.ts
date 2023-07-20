import {SyntheticEvent} from 'react';

export type MaplibreGLEvent<
  T extends string,
  P = GeoJSON.Feature,
  V = Element,
> = SyntheticEvent<V, {type: T; payload: P}>;
