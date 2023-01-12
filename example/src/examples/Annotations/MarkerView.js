import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import PropTypes from 'prop-types';

import sheet from '../../styles/sheet';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import Page from '../common/Page';
import Bubble from '../common/Bubble';

const styles = {
  touchableContainer: {borderColor: 'black', borderWidth: 1.0, width: 60},
  touchable: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

const AnnotationContent = ({title}) => (
  <View style={styles.touchableContainer}>
    <Text>{title}</Text>
    <TouchableOpacity style={styles.touchable}>
      <Text style={styles.touchableText}>Btn</Text>
    </TouchableOpacity>
  </View>
);
AnnotationContent.propTypes = {
  title: PropTypes.string,
};

class ShowMarkerView extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: 'blue',
      coordinates: [
        [-73.99155, 40.73581],
        [-73.99155, 40.73681],
      ],
    };
  }

  render() {
    return (
      <Page {...this.props}>
        <MapLibreGL.MapView
          ref={c => (this._map = c)}
          onPress={this.onPress}
          onDidFinishLoadingMap={this.onDidFinishLoadingMap}
          style={sheet.matchParent}>
          <MapLibreGL.Camera
            zoomLevel={16}
            centerCoordinate={this.state.coordinates[0]}
          />

          <MapLibreGL.PointAnnotation
            coordinate={this.state.coordinates[1]}
            id="pt-ann">
            <AnnotationContent title={'this is a point annotation'} />
          </MapLibreGL.PointAnnotation>

          <MapLibreGL.MarkerView coordinate={this.state.coordinates[0]}>
            <AnnotationContent title={'this is a marker view'} />
          </MapLibreGL.MarkerView>
        </MapLibreGL.MapView>

        <Bubble>
          <Text>Click to add a point annotation</Text>
        </Bubble>
      </Page>
    );
  }
}

export default ShowMarkerView;
