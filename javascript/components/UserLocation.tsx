import locationManager, {Location} from '../modules/location/locationManager';
import {CircleLayerStyleProps} from '../utils/MaplibreStyles';

import Annotation from './annotations/Annotation';
import CircleLayer from './CircleLayer';
import HeadingIndicator from './HeadingIndicator';
import NativeUserLocation from './NativeUserLocation';

import React, {ReactElement} from 'react';

const mapboxBlue = 'rgba(51, 181, 229, 100)';

const layerStyles: Record<string, CircleLayerStyleProps> = {
  pluse: {
    circleRadius: 15,
    circleColor: mapboxBlue,
    circleOpacity: 0.2,
    circlePitchAlignment: 'map',
  },
  background: {
    circleRadius: 9,
    circleColor: '#fff',
    circlePitchAlignment: 'map',
  },
  foreground: {
    circleRadius: 6,
    circleColor: mapboxBlue,
    circlePitchAlignment: 'map',
  },
};

export const normalIcon = (
  showsUserHeadingIndicator?: boolean,
  heading?: number,
): ReactElement[] => [
  <CircleLayer
    key="mapboxUserLocationPluseCircle"
    id="mapboxUserLocationPluseCircle"
    style={layerStyles.pluse}
  />,
  <CircleLayer
    key="mapboxUserLocationWhiteCircle"
    id="mapboxUserLocationWhiteCircle"
    style={layerStyles.background}
  />,
  <CircleLayer
    key="mapboxUserLocationBlueCicle"
    id="mapboxUserLocationBlueCicle"
    aboveLayerID="mapboxUserLocationWhiteCircle"
    style={layerStyles.foreground}
  />,
  ...(showsUserHeadingIndicator && heading
    ? [HeadingIndicator({heading})]
    : []),
];

interface UserLocationProps {
  /**
   * Whether location icon is animated between updates
   */
  animated?: boolean;
  /**
   * Which render mode to use.
   * Can either be `normal` or `native`
   */
  renderMode?: 'normal' | 'native';
  /**
   * native/android only render mode
   *
   *  - normal: just a circle
   *  - compass: triangle with heading
   *  - gps: large arrow
   *
   * @platform android
   */
  androidRenderMode?: 'normal' | 'compass' | 'gps';
  /**
   * Whether location icon is visible
   */
  visible?: boolean;
  /**
   * Callback that is triggered on location icon press
   */
  onPress?(): void;
  /**
   * Callback that is triggered on location update
   */
  onUpdate?(location: Location): void;
  /**
   * Show or hide small arrow which indicates direction the device is pointing relative to north.
   */
  showsUserHeadingIndicator?: boolean;
  /**
   * Minimum amount of movement before GPS location is updated in meters
   */
  minDisplacement?: number;
  /**
   * Custom location icon of type mapbox-gl-native components
   *
   * NOTE: Forking maintainer does not understand the above comment.
   */
  children?: ReactElement | ReactElement[];
}

interface UserLocationState {
  shouldShowUserLocation: boolean;
  coordinates?: number[];
  heading?: number;
}

export enum UserLocationRenderMode {
  Native = 'native',
  Normal = 'normal',
}

class UserLocation extends React.Component<
  UserLocationProps,
  UserLocationState
> {
  static defaultProps = {
    animated: true,
    visible: true,
    showsUserHeadingIndicator: false,
    minDisplacement: 0,
    renderMode: 'normal',
  };

  constructor(props: UserLocationProps) {
    super(props);

    this.state = {
      shouldShowUserLocation: false,
    };

    this._onLocationUpdate = this._onLocationUpdate.bind(this);
  }

  // required as #setLocationManager attempts to setState
  // after component unmount
  _isMounted: boolean | null = null;

  renderMode: UserLocationRenderMode | undefined;
  locationManagerRunning = false;

  async componentDidMount(): Promise<void> {
    this._isMounted = true;

    await this.setLocationManager({
      running: this.needsLocationManagerRunning(),
    });

    if (this.renderMode === UserLocationRenderMode.Native) {
      return;
    }

    locationManager.setMinDisplacement(this.props.minDisplacement ?? 0);
  }

  async componentDidUpdate(prevProps: UserLocationProps): Promise<void> {
    await this.setLocationManager({
      running: this.needsLocationManagerRunning(),
    });

    if (this.props.minDisplacement !== prevProps.minDisplacement) {
      locationManager.setMinDisplacement(this.props.minDisplacement ?? 0);
    }
  }

  async componentWillUnmount(): Promise<void> {
    this._isMounted = false;
    await this.setLocationManager({running: false});
  }

  /**
   * Whether to start or stop listening to the locationManager
   *
   * Notice, that listening will start automatically when
   * either `onUpdate` or `visible` are set
   *
   * @async
   * @param {Object} running - Object with key `running` and `boolean` value
   * @return {Promise<void>}
   */
  async setLocationManager({running}: {running: boolean}): Promise<void> {
    if (this.locationManagerRunning !== running) {
      this.locationManagerRunning = running;
      if (running) {
        locationManager.addListener(this._onLocationUpdate);
        const location = await locationManager.getLastKnownLocation();
        this._onLocationUpdate(location);
      } else {
        locationManager.removeListener(this._onLocationUpdate);
      }
    }
  }

  /**
   *
   * If locationManager should be running
   *
   * @return {boolean}
   */
  needsLocationManagerRunning(): boolean {
    return !!(
      !!this.props.onUpdate ||
      (this.props.renderMode === UserLocationRenderMode.Normal &&
        this.props.visible)
    );
  }

  _onLocationUpdate(location: Location | null): void {
    if (!this._isMounted || !location) {
      return;
    }
    let coordinates;
    let heading;

    if (location && location.coords) {
      const {longitude, latitude} = location.coords;
      heading = location.coords.heading;
      coordinates = [longitude, latitude];
    }

    this.setState({
      coordinates,
      heading,
    });

    if (this.props.onUpdate) {
      this.props.onUpdate(location);
    }
  }

  _renderNative(): ReactElement {
    const {androidRenderMode, showsUserHeadingIndicator} = this.props;

    const props = {
      androidRenderMode,
      iosShowsUserHeadingIndicator: showsUserHeadingIndicator,
    };
    return <NativeUserLocation {...props} />;
  }

  render(): ReactElement | null {
    const {heading, coordinates} = this.state;
    const {children, visible, showsUserHeadingIndicator, onPress, animated} =
      this.props;

    if (!visible) {
      return null;
    }

    if (this.props.renderMode === UserLocationRenderMode.Native) {
      return this._renderNative();
    }

    if (!coordinates) {
      return null;
    }

    return (
      <Annotation
        animated={animated}
        id="mapboxUserLocation"
        onPress={onPress}
        coordinates={coordinates}
        style={{
          iconRotate: heading,
        }}>
        {children || normalIcon(showsUserHeadingIndicator, heading)}
      </Annotation>
    );
  }
}

export default UserLocation;
