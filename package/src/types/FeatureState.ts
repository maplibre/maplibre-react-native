/**
 * A JSON-serializable value, as accepted by the `feature-state` expression.
 */
export type FeatureStateValue =
  | string
  | number
  | boolean
  | null
  | FeatureStateValue[]
  | FeatureState;

/**
 * Runtime key-value state attached to a single feature. Read it in style
 * expressions with `["feature-state", "key"]` .
 */
export interface FeatureState {
  [key: string]: FeatureStateValue;
}
