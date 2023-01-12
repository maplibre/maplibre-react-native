import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';

class SetPitch extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      followPitch: 15,
      zoomLevel: 16,
      duration: 300,
    };

    this._pitchOptions = [
      {label: '15', data: 15},
      {label: '45', data: 45},
      {label: '60', data: 60},
    ];

    this.onUpdatePitch = this.onUpdatePitch.bind(this);
  }

  componentDidMount() {
    MapLibreGL.locationManager.start();
  }

  componentWillUnmount() {
    MapLibreGL.locationManager.stop();
  }

  onUpdatePitch(index, pitch) {
    this.setState({followPitch: pitch});
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        options={this._pitchOptions}
        onOptionPress={this.onUpdatePitch}>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera {...this.state} followUserLocation />
          <MapLibreGL.UserLocation />
        </MapLibreGL.MapView>
      </TabBarPage>
    );
  }
}

export default SetPitch;
