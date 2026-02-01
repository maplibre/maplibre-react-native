import { type FilterExpression } from "../types/MapLibreRNStyles";

export function getFilter(
  filter: FilterExpression | undefined,
): FilterExpression {
  if (!Array.isArray(filter)) {
    return [] as unknown as FilterExpression;
  }

  return filter;
}
