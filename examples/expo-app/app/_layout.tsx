import {View, Text} from 'react-native';
import {Drawer} from 'expo-router/drawer';
import {FileSystemView} from './(examples)';
import React from 'react';

function CustomDrawerContent() {
  return (
    <View style={{marginTop: 40, marginBottom: 40}}>
      <Text>Examples</Text>
      <FileSystemView />
    </View>
  );
}

export default function Root() {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="(examples)"
        options={{
          drawerLabel: 'Examples',
          title: 'overview',
          headerShown: true,
        }}
      />
    </Drawer>
  );
}
