export const EU_BOUNDS = {
  ne: [40, 70] as [number, number],
  sw: [-20, 30] as [number, number],
};

export const US_BOUNDS = {
  ne: [-60, 60],
  sw: [-140, 20],
} as const;

export const EU_CENTER_COORDINATES = [
  (EU_BOUNDS.ne[0] + EU_BOUNDS.sw[0]) / 2,
  (EU_BOUNDS.ne[1] + EU_BOUNDS.sw[1]) / 2,
];

export const US_CENTER_COORDINATES = [
  (US_BOUNDS.ne[0] + US_BOUNDS.sw[0]) / 2,
  (US_BOUNDS.ne[1] + US_BOUNDS.sw[1]) / 2,
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
      [8.070566386917108, 53.295365558646694],
      [13.37432488261203, 52.50503393836857],
      [7.218077210609579, 50.98270036522064],
      [13.652081261390094, 49.583747114745165],
      [8.1694637345079, 47.9516814815924],
    ],
  },
  properties: {},
};
