import React, {ReactElement} from 'react';

import BaseProps from '../types/BaseProps';
import headingIcon from '../../assets/heading.png';

import SymbolLayer from './SymbolLayer';

const style = {
  iconImage: headingIcon,
  iconAllowOverlap: true,
  iconPitchAlignment: 'map',
  iconRotationAlignment: 'map',
} as const;

interface HeadingIndicatorProps extends BaseProps {
  heading?: number;
}

const HeadingIndicator = ({heading}: HeadingIndicatorProps): ReactElement => (
  <SymbolLayer
    key="mapboxUserLocationHeadingIndicator"
    id="mapboxUserLocationHeadingIndicator"
    belowLayerID="mapboxUserLocationWhiteCircle"
    style={{
      iconRotate: heading,
      ...style,
    }}
  />
);

export default HeadingIndicator;
