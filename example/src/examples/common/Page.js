import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation, useRoute} from '@react-navigation/native';

import sheet from '../../styles/sheet';
import colors from '../../styles/colors';

import MapHeader from './MapHeader';

function Page({children}) {
  const navigation = useNavigation();
  const route = useRoute();
  const label = route.name;

  return (
    <View style={sheet.matchParent}>
      <MapHeader
        backgroundColor={colors.primary.pink}
        statusBarColor={colors.primary.pinkDark}
        statusBarTextTheme={'light-content'}
        label={label}
        onBack={() => navigation.goBack()}
      />
      {children}
    </View>
  );
}

Page.propTypes = {
  children: PropTypes.oneOf(
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ),
};

export default Page;
