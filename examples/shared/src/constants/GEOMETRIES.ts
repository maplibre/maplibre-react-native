import type { LngLat, LngLatBounds } from "@maplibre/maplibre-react-native";

export const EU_BOUNDS: LngLatBounds = [-20, 30, 40, 70];
export const US_BOUNDS: LngLatBounds = [-140, 20, -60, 60];

export const EU_CENTER_COORDINATES: LngLat = [
  (EU_BOUNDS[0] + EU_BOUNDS[2]) / 2,
  (EU_BOUNDS[1] + EU_BOUNDS[3]) / 2,
];

export const US_CENTER_COORDINATES: LngLat = [
  (US_BOUNDS[0] + US_BOUNDS[2]) / 2,
  (US_BOUNDS[1] + US_BOUNDS[3]) / 2,
];

export const FEATURE_COLLECTION: GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { name: string }
> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "eu",
      geometry: {
        type: "Point",
        coordinates: EU_CENTER_COORDINATES,
      },
      properties: {
        name: "EU Center",
      },
    },
    {
      type: "Feature",
      id: "us",
      geometry: {
        type: "Point",
        coordinates: US_CENTER_COORDINATES,
      },
      properties: {
        name: "US Center",
      },
    },
  ],
};

export const ROUTE_FEATURE: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [13.364387065834478, 52.546431251184714],
      [2.475103254349648, 48.80058684206949],
      [-3.553645430300577, 40.38664602683713],
      [12.461163916568182, 41.90095229711977],
    ],
  },
  properties: {},
};

export const ROUTE_FEATURE_BOUNDS: LngLatBounds = [
  -4.553645430300577, 39.38664602683713, 14.364387065834478, 53.546431251184714,
];
