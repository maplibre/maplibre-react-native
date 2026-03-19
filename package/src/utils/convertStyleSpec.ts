import type { AllLayerStyle } from "../types/MapLibreRNStyles";

/**
 * Converts a kebab-case string to camelCase.
 *
 * @example
 * kebabToCamel('fill-color') // Returns: 'fillColor'
 * kebabToCamel('line-gap-width') // Returns: 'lineGapWidth'
 */
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Converts style spec compliant paint/layout objects (kebab-case)
 * to internal style format (camelCase).
 *
 * @example
 * convertToInternalStyle({ 'fill-color': 'red' })
 * // Returns: { fillColor: 'red' }
 */
export function convertToInternalStyle(
  specStyle: Record<string, unknown> | undefined,
): Partial<AllLayerStyle> | undefined {
  if (!specStyle) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(specStyle)) {
    result[kebabToCamel(key)] = specStyle[key];
  }

  return result as Partial<AllLayerStyle>;
}

/**
 * Merges paint and layout props into a single internal style object.
 * Priority order (highest to lowest): paint > layout > style (deprecated)
 */
export function mergeStyleProps(
  paint: Record<string, unknown> | undefined,
  layout: Record<string, unknown> | undefined,
  deprecatedStyle: AllLayerStyle | undefined,
): AllLayerStyle | undefined {
  const convertedPaint = convertToInternalStyle(paint);
  const convertedLayout = convertToInternalStyle(layout);

  // If nothing provided, return undefined
  if (!convertedPaint && !convertedLayout && !deprecatedStyle) {
    return undefined;
  }

  // Merge: deprecated style has lowest precedence
  return {
    ...deprecatedStyle,
    ...convertedLayout,
    ...convertedPaint,
  } as AllLayerStyle;
}
