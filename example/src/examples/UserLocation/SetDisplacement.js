import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';

const DISPLACEMENT = [0, 5, 10];
const OPTIONS = [{label: '0 meter'}, {label: '5 meter'}, {label: '10 meter'}];

class SetDisplacement extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  state = {minDisplacement: DISPLACEMENT[0]};

  componentDidMount() {
    MapLibreGL.locationManager.start();
  }

  componentWillUnmount() {
    MapLibreGL.locationManager.stop();
  }

  onDisplacementChange = index => {
    this.setState({minDisplacement: DISPLACEMENT[index]});
  };

  render() {
    return (
      <TabBarPage
        {...this.props}
        options={OPTIONS}
        onOptionPress={this.onDisplacementChange}>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera
            followZoomLevel={16}
            followUserMode="compass"
            followUserLocation
          />

          <MapLibreGL.UserLocation
            minDisplacement={this.state.minDisplacement}
          />
        </MapLibreGL.MapView>
      </TabBarPage>
    );
  }
}

export default SetDisplacement;
