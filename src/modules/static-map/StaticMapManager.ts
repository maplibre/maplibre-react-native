import NativeStaticMapModule from "./NativeStaticMapModule";
import type { LngLat } from "../../types/LngLat";
import type { LngLatBounds } from "../../types/LngLatBounds";

export interface StaticMapOptions {
  /**
   * Maplibre style - either a URL or a Style JSON.
   *
   * @see https://maplibre.org/maplibre-style-spec/
   */
  mapStyle: string | object;

  /**
   * Width of the image in pixels.
   */
  width: number;

  /**
   * Height of the image in pixels.
   */
  height: number;

  /**
   * Defines the way the image is returned.
   *
   * - "base64": base64 encoded string of the image
   * - "file": URI to a temporary file image
   */
  output: "base64" | "file";

  /**
   * Toggle the MapLibre logo on the image.
   *
   * MapLibre doesn't require you to display the logo.
   */
  logo?: boolean;
}

export type StaticMapCenterOptions = StaticMapOptions & {
  /**
   * The center coordinate of the map.
   */
  center: LngLat;

  /**
   * The zoom level of the map.
   */
  zoom?: number;

  /**
   *  The bearing (rotation) of the map.
   */
  bearing?: number;

  /**
   * The pitch of the map.
   */
  pitch?: number;
};

export type StaticMapBoundsOptions = StaticMapOptions & {
  /**
   * The corners of a box around which the map should bound.
   */
  bounds: LngLatBounds;
};

export type StaticMapCreateOptions =
  | (StaticMapCenterOptions & { bounds?: never })
  | (StaticMapBoundsOptions & {
      center?: never;
      zoom?: never;
      bearing?: never;
      pitch?: never;
    });

/**
 * The StaticMapManager creates static images of a map.
 */
class StaticMapManager {
  /**
   * Creates a static image of a map. Images are always in PNG format.
   *
   * @example
   * // Create static map with center, returning the URI to the temporary PNG file
   * const uri = await StaticMapManager.create({
   *   center: [-74.126410, 40.797968 ],
   *   zoom: 12,
   *   bearing: 20,
   *   pitch: 30,
   *   mapStyle: "https://demotiles.maplibre.org/style.json",
   *   width: 128,
   *   height: 64,
   *   output: "file",
   * });
   *
   * // Create a static map with bounds, returning a base64 encoded PNG
   * const uri = await StaticMapManager.create({
   *   bounds: [[-74.126410, 40.797968], [-74.143727, 40.772177]],
   *   mapStyle: "https://demotiles.maplibre.org/style.json",
   *   width: 128,
   *   height: 64,
   *   output: "base64",
   * });
   */
  async createImage({
    mapStyle,
    ...options
  }: StaticMapCreateOptions): Promise<string> {
    return NativeStaticMapModule.createImage({
      mapStyle:
        typeof mapStyle === "string" ? mapStyle : JSON.stringify(mapStyle),
      ...options,
    });
  }
}

const staticMapImageManager = new StaticMapManager();
export { staticMapImageManager as StaticMapImageManager };
