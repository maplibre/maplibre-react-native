/**
 * Type of resource being requested. Matches maplibre-gl-js ResourceType.
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/enumerations/ResourceType/
 */
export enum ResourceType {
  Glyphs = "Glyphs",
  Image = "Image",
  Source = "Source",
  SpriteImage = "SpriteImage",
  SpriteJSON = "SpriteJSON",
  Style = "Style",
  Tile = "Tile",
  Unknown = "Unknown",
}

/**
 * Parameters for a transformed request. Matches maplibre-gl-js RequestParameters.
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/RequestParameters/
 */
export interface RequestParameters {
  /**
   * The URL to be requested
   */
  url: string;

  /**
   * The headers to be sent with the request
   */
  headers?: Record<string, string>;

  /**
   * HTTP request method
   */
  method?: "GET" | "POST" | "PUT";

  /**
   * Request body
   */
  body?: string;

  /**
   * Response body type to be returned
   */
  type?: "string" | "json" | "arrayBuffer" | "image";

  /**
   * Use 'include' to send cookies with cross-origin requests
   */
  credentials?: "same-origin" | "include";

  /**
   * If true, Resource Timing API information will be collected
   */
  collectResourceTiming?: boolean;
}

/**
 * Function to transform a request before it is made.
 * Matches maplibre-gl-js RequestTransformFunction.
 *
 * @param url - The URL to be requested
 * @param resourceType - The type of resource being requested
 * @returns Modified request parameters, or undefined to use the original URL
 *
 * @example
 * ```typescript
 * const transformRequest: RequestTransformFunction = (url, resourceType) => {
 *   if (url.includes('api.mapbox.com')) {
 *     return {
 *       url: `${url}${url.includes('?') ? '&' : '?'}access_token=${MAPBOX_API_KEY}`,
 *     };
 *   }
 * };
 * ```
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/RequestTransformFunction/
 */
export type RequestTransformFunction = (
  url: string,
  resourceType: ResourceType,
) => RequestParameters | undefined;
