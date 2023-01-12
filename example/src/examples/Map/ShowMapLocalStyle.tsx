import React, {FC, useEffect} from 'react';
import {Alert} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import Page from '../common/Page';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const style = JSON.stringify(require('../../assets/map-styleURL-style.json'));

const ShowMap: FC<any> = props => {
  useEffect(() => {
    MapLibreGL.locationManager.start();

    return (): void => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  const onUserMarkerPress = (): void => {
    Alert.alert('You pressed on the user location annotation');
  };

  return (
    <Page {...props}>
      <MapLibreGL.MapView styleURL={style} style={sheet.matchParent}>
        <MapLibreGL.Camera followZoomLevel={3} followUserLocation />

        <MapLibreGL.UserLocation onPress={onUserMarkerPress} />
      </MapLibreGL.MapView>
    </Page>
  );
};

export default ShowMap;
