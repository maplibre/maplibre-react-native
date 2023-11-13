import React, {ReactElement} from 'react';
import {View} from 'react-native';
import sheet from '@/styles/sheet';

interface PageProps {
  children: ReactElement | ReactElement[];
}

const Page = ({children}: PageProps): ReactElement => {
  return <View style={sheet.matchParent}>{children}</View>;
};

export default Page;
