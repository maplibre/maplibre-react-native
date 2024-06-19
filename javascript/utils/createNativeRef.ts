import {Component, useRef} from 'react';
import {NativeMethods} from 'react-native';

/**
 * Separate  module which allows to be mocked in tests.
 */
export function createNativeRef<NativeProps = {}>() {
  return useRef<Component<NativeProps> & Readonly<NativeMethods>>(null);
}
