import MapView from '../../javascript/components/MapView';

import * as React from 'react';
import {render} from '@testing-library/react-native';

describe('MapView', () => {
  test('renders with testID', () => {
    const expectedTestId = 'im used for identification in tests';

    const {getByTestId} = render(<MapView testID={expectedTestId} />);

    expect(() => {
      getByTestId(expectedTestId);
    }).not.toThrowError();
  });
});
