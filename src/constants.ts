/**
 * Default style URL for MapLibre maps.
 * This points to the MapLibre demo tiles style.
 */
export const StyleURL = {
  Default: "https://demotiles.maplibre.org/style.json",
} as const;

/**
 * Default source ID constants.
 */
export const StyleSource = {
  DefaultSourceID: "composite",
} as const;

/**
 * Offline pack download state constants.
 * Used to track the status of offline region downloads.
 */
export const OfflinePackDownloadState = {
  /** The pack download is inactive/paused */
  Inactive: 0,
  /** The pack is actively downloading */
  Active: 1,
  /** The pack download is complete */
  Complete: 2,
} as const;

export type OfflinePackDownloadStateType =
  (typeof OfflinePackDownloadState)[keyof typeof OfflinePackDownloadState];

/**
 * Offline callback name constants.
 * Used for subscribing to offline pack events.
 */
export const OfflineCallbackName = {
  Progress: "OfflineProgress",
  Error: "OfflineError",
} as const;
