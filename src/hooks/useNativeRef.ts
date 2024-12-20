import { Component, type RefObject, useRef } from "react";
import { type NativeMethods } from "react-native";

export type NativeRef<NativeProps> = Component<NativeProps> &
  Readonly<NativeMethods>;

/**
 * Separate  module which allows to be mocked in tests.
 */
export function useNativeRef<NativeProps = object>(): RefObject<
  NativeRef<NativeProps>
> {
  return useRef<NativeRef<NativeProps>>(null);
}
