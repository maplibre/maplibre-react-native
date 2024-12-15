import { type FilterExpression } from "../types/MapLibreRNStyles";

export function getFilter(filter: FilterExpression | undefined): string[] {
  if (!Array.isArray(filter) || filter.length === 0) {
    return [];
  }

  return filter;
}
