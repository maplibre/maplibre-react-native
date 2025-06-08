/**
 * RN codegen's own definition is `type UnsafeMixed = unknown` and generates
 * folly::dynamic. This type is an alternative, allowing to set a type within
 * TypeScript. Because RN codegen doesn't follow imports and only checks for the
 * name of the type, this is a way to override theirs.
 */
export type UnsafeMixed<T> = T;
