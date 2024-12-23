import { Component, useRef } from "react";
import { type NativeMethods } from "react-native";

export function useAbstractSource<NativePropsType extends object>(): {
  _nativeRef:
    | (Component<NativePropsType> & Readonly<NativeMethods>)
    | undefined;
  setNativeRef: (
    instance: Component<NativePropsType> & Readonly<NativeMethods>,
  ) => void;
  setNativeProps: (nativeProps: NativePropsType) => void;
} {
  const _nativeRef = useRef<
    (Component<NativePropsType> & Readonly<NativeMethods>) | undefined
  >(undefined);

  const setNativeRef = (
    instance: Component<NativePropsType> & Readonly<NativeMethods>,
  ): void => {
    _nativeRef.current = instance;
  };

  const setNativeProps = (newProps: NativePropsType): void => {
    if (_nativeRef.current) {
      _nativeRef.current.setNativeProps(newProps);
    }
  };

  return {
    _nativeRef: _nativeRef.current,
    setNativeRef,
    setNativeProps,
  };
}
