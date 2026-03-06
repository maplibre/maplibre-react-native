import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";

import {
  type RequestTransformFunction,
  ResourceType,
} from "../types/TransformRequest";

/**
 * Transforms a URL using the transformRequest function if provided.
 * Returns the original URL if transformRequest returns undefined.
 */
function transformUrl(
  url: string,
  resourceType: ResourceType,
  transformRequest: RequestTransformFunction,
): string {
  const result = transformRequest(url, resourceType);
  return result?.url ?? url;
}

/**
 * Applies a transformRequest function to all URLs in a StyleSpecification.
 *
 * This transforms URLs for:
 * - Sprite (sprite image and JSON URLs)
 * - Glyphs (font URLs)
 * - Sources (tile URLs, TileJSON URLs)
 *
 * @param style - The style specification to transform
 * @param transformRequest - The function to transform each URL
 * @returns A new StyleSpecification with transformed URLs
 *
 * @example
 * ```typescript
 * const transformed = applyTransformRequest(style, (url, resourceType) => {
 *   if (url.includes('api.mapbox.com')) {
 *     return { url: `${url}?access_token=${API_KEY}` };
 *   }
 * });
 * ```
 */
export function applyTransformRequest(
  style: StyleSpecification,
  transformRequest: RequestTransformFunction,
): StyleSpecification {
  // Deep clone to avoid mutating the original
  const transformed: StyleSpecification = JSON.parse(JSON.stringify(style));

  // Transform sprite URLs
  if (transformed.sprite) {
    if (typeof transformed.sprite === "string") {
      transformed.sprite = transformUrl(
        transformed.sprite,
        ResourceType.SpriteImage,
        transformRequest,
      );
    } else if (Array.isArray(transformed.sprite)) {
      transformed.sprite = transformed.sprite.map((sprite) => ({
        ...sprite,
        url: transformUrl(sprite.url, ResourceType.SpriteImage, transformRequest),
      }));
    }
  }

  // Transform glyphs URL
  if (transformed.glyphs) {
    transformed.glyphs = transformUrl(
      transformed.glyphs,
      ResourceType.Glyphs,
      transformRequest,
    );
  }

  // Transform source URLs
  if (transformed.sources) {
    for (const sourceId of Object.keys(transformed.sources)) {
      const source = transformed.sources[sourceId];

      if (!source) continue;

      // Transform TileJSON URL (url property)
      if ("url" in source && typeof source.url === "string") {
        (source as { url: string }).url = transformUrl(
          source.url,
          ResourceType.Source,
          transformRequest,
        );
      }

      // Transform tile URLs (tiles array)
      if ("tiles" in source && Array.isArray(source.tiles)) {
        (source as { tiles: string[] }).tiles = source.tiles.map((tile) =>
          transformUrl(tile, ResourceType.Tile, transformRequest),
        );
      }
    }
  }

  return transformed;
}
