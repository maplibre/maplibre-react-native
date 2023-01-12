import React from 'react';
import {Alert} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';

class FlyTo extends React.Component {
  static SF_OFFICE_LOCATION = [-122.400021, 37.789085];

  static DC_OFFICE_LOCATION = [-77.036086, 38.910233];

  static ZERO_ZERO = [0, 0];
  static ZERO_TEN = [0, 10];
  static TEN_ZERO = [10, 0];

  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      location: FlyTo.SF_OFFICE_LOCATION,
    };

    this._flyToOptions = [
      {label: 'SF', data: FlyTo.SF_OFFICE_LOCATION},
      {label: 'DC', data: FlyTo.DC_OFFICE_LOCATION},
      {label: '0,0', data: FlyTo.ZERO_ZERO},
      {label: '0,10', data: FlyTo.ZERO_TEN},
      {label: '10,0', data: FlyTo.TEN_ZERO},
    ];

    this.onFlyToPress = this.onFlyToPress.bind(this);
    this.onFlyToComplete = this.onFlyToComplete.bind(this);
  }

  onFlyToPress(i) {
    this.setState({location: this._flyToOptions[i].data});
  }

  onFlyToComplete() {
    Alert.alert('Fly To Animation Completed', 'We did it!!!');
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        options={this._flyToOptions}
        onOptionPress={this.onFlyToPress}>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera
            zoomLevel={6}
            animationMode={'flyTo'}
            animationDuration={6000}
            centerCoordinate={this.state.location}
          />

          <MapLibreGL.UserLocation />
        </MapLibreGL.MapView>
      </TabBarPage>
    );
  }
}

export default FlyTo;
