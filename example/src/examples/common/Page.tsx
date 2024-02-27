import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import sheet from '../../styles/sheet';
import colors from '../../styles/colors';

import MapHeader from './MapHeader';

interface PageProps {
  children: ReactElement | ReactElement[];
}

const Page = ({children}: PageProps): ReactElement => {
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
        onBack={(): void => navigation.goBack()}
      />
      {children}
    </View>
  );
};

export default Page;
