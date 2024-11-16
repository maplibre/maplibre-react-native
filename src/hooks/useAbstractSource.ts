import React, { useRef } from "react";
import { NativeMethods } from "react-native";

export default function useAbstractSource<NativePropsType extends object>(): {
  _nativeRef:
    | (React.Component<NativePropsType> & Readonly<NativeMethods>)
    | undefined;
  setNativeRef: (
    instance: React.Component<NativePropsType> & Readonly<NativeMethods>,
  ) => void;
  setNativeProps: (nativeProps: NativePropsType) => void;
} {
  const _nativeRef = useRef<
    (React.Component<NativePropsType> & Readonly<NativeMethods>) | undefined
  >(undefined);

  const setNativeRef = (
    instance: React.Component<NativePropsType> & Readonly<NativeMethods>,
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
