import React from 'react';
import {MapView, Camera} from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import Page from '../common/Page';

function CompassView() {
  return (
    <Page>
      <MapView
        style={sheet.matchParent}
        compassEnabled
        logoEnabled={false}
        compassViewPosition={2}>
        <Camera heading={21} />
      </MapView>
    </Page>
  );
}

export default CompassView;
