/**
 * A JSON-serializable value, as accepted by the `feature-state` expression.
 */
export type FeatureStateValue =
  | string
  | number
  | boolean
  | null
  | FeatureStateValue[]
  | { [key: string]: FeatureStateValue };

/**
 * Runtime key-value state attached to a single feature. Read it in style
 * expressions with `["feature-state", "key"]` .
 */
export type FeatureState = Record<string, FeatureStateValue>;
