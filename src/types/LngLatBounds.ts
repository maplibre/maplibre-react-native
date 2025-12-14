/**
 * Represents bounds in geographic coordinates
 *
 * Uses order of south-west and north-east corners in flat style per GeoJSON RFC.
 */
export type LngLatBounds = [
  west: number,
  south: number,
  east: number,
  north: number,
];
