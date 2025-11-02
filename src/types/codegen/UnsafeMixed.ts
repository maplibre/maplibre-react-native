/**
 * This type makes it possible to us strict types in TypeScript while being
 * loose on native.
 *
 * RN codegen specifies `type UnsafeMixed = unknown` mapping to folly::dynamic.
 * During codegen only the name of the type is analyzed, making it possible to
 * override their type this way.
 */
export type UnsafeMixed<T> = T;
