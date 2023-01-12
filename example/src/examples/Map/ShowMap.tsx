import React, {FC, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import {onSortOptions} from '../../utils';
import TabBarPage from '../common/TabBarPage';

const ShowMap: FC<any> = props => {
  const _mapOptions = Object.keys(MapLibreGL.StyleURL)
    .map(key => {
      return {
        label: key,
        data: (MapLibreGL.StyleURL as any)[key], // bad any, because enums
      };
    })
    .sort(onSortOptions);

  const [styleURL, setStyleURL] = useState({styleURL: _mapOptions[0].data});

  useEffect(() => {
    MapLibreGL.locationManager.start();

    return (): void => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  const onMapChange = (
    index: number,
    newStyleURL: MapLibreGL.StyleURL,
  ): void => {
    setStyleURL({styleURL: newStyleURL});
  };

  const onUserMarkerPress = (): void => {
    Alert.alert('You pressed on the user location annotation');
  };

  return (
    <TabBarPage
      {...props}
      scrollable
      options={_mapOptions}
      onOptionPress={onMapChange}>
      <MapLibreGL.MapView
        styleURL={styleURL.styleURL}
        style={sheet.matchParent}>
        <MapLibreGL.Camera followZoomLevel={6} followUserLocation />

        <MapLibreGL.UserLocation onPress={onUserMarkerPress} />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
};

export default ShowMap;
