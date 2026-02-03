/**
 * Position anchor for markers and annotations.
 * Follows MapLibre GL JS PositionAnchor format.
 *
 * @see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/
 */
export type Anchor =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * Converts an Anchor string to native {x, y} format.
 * x: 0 = left, 0.5 = center, 1 = right
 * y: 0 = top, 0.5 = center, 1 = bottom
 */
export function anchorToNative(anchor: Anchor): { x: number; y: number } {
  switch (anchor) {
    case "center":
      return { x: 0.5, y: 0.5 };
    case "top":
      return { x: 0.5, y: 0 };
    case "bottom":
      return { x: 0.5, y: 1 };
    case "left":
      return { x: 0, y: 0.5 };
    case "right":
      return { x: 1, y: 0.5 };
    case "top-left":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: 1, y: 0 };
    case "bottom-left":
      return { x: 0, y: 1 };
    case "bottom-right":
      return { x: 1, y: 1 };
  }
}
