import React, {ReactElement} from 'react';
import {requireNativeComponent} from 'react-native';

const NATIVE_MODULE_NAME = 'RCTMLNNativeUserLocation';

interface NativeUserLocationProps {
  /**
   * Android render mode.
   *
   *  - normal: just a circle
   *  - compass: triangle with heading
   *  - gps: large arrow
   *
   * @platform android
   */
  androidRenderMode?: 'normal' | 'compass' | 'gps';
  /**
   * iOS only. A Boolean value indicating whether the user location annotation may display a permanent heading indicator.
   *
   * @platform ios
   */
  iosShowsUserHeadingIndicator?: boolean;
}

class NativeUserLocation extends React.Component<NativeUserLocationProps> {
  render(): ReactElement {
    return <RCTMLNNativeUserLocation {...this.props} />;
  }
}

const RCTMLNNativeUserLocation = requireNativeComponent(NATIVE_MODULE_NAME);

export default NativeUserLocation;
