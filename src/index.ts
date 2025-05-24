import * as MapLibreRN from "./MapLibreRN";
import NativeExampleModule from "./NativeExampleModule";
export * from "./MapLibreRN";

export function multiply(a: number, b: number): number {
  return NativeExampleModule.multiply(a, b);
}

/**
 * @deprecated Use named imports or `import * as MapLibreRN` instead
 */
export default MapLibreRN;
