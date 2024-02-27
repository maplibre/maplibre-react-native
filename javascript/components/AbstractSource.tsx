import BaseProps from '../types/BaseProps';

import React from 'react';
import {NativeMethods} from 'react-native';

class AbstractSource<
  PropsType extends BaseProps,
  NativePropsType extends object,
> extends React.PureComponent<PropsType> {
  _nativeRef?: React.Component<NativePropsType> & Readonly<NativeMethods>;

  setNativeProps(props: NativePropsType): void {
    if (this._nativeRef) {
      this._nativeRef.setNativeProps(props);
    }
  }

  setNativeRef: (
    instance: React.Component<NativePropsType> & Readonly<NativeMethods>,
  ) => void = (
    instance: React.Component<NativePropsType> & Readonly<NativeMethods>,
  ) => {
    this._nativeRef = instance;
  };
}

export default AbstractSource;
