import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import PropTypes from 'prop-types';

import * as MaplibreExamples from '../examples';
import { default as MapHeader } from '../examples/common/MapHeader'
import { default as sheet } from '../styles/sheet'

const styles = StyleSheet.create({
  exampleList: {
    flex: 1,
  },
  exampleListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  exampleListItemBorder: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  exampleListLabel: {
    fontSize: 18,
  },
});

class ExampleItem {
  constructor(label, Component) {
    this.label = label;
    this.Component = Component;
  }
}

class ExampleGroup {
  constructor(label, items, root = false) {
    this.root = root;
    this.label = label;
    this.items = items;
  }
}

const Examples = new ExampleGroup(
  'React Native Mapbox GL',
  [
    new ExampleItem('Bug Report Template', MaplibreExamples.BugReportPage),
    new ExampleGroup('Map', [
      new ExampleItem('Show Map', MaplibreExamples.ShowMap),
      new ExampleItem('Show Map With Local Style.JSON', MaplibreExamples.ShowMapLocalStyle),
      new ExampleItem('Show Click', MaplibreExamples.ShowClick),
      new ExampleItem('Show Region Did Change', MaplibreExamples.ShowRegionDidChange),
      new ExampleItem('Two Map Views', MaplibreExamples.TwoByTwo),
      new ExampleItem('Create Offline Region', MaplibreExamples.CreateOfflineRegion),
      new ExampleItem('Get Pixel Point in MapView', MaplibreExamples.PointInMapView),
      new ExampleItem('Show and hide a layer', MaplibreExamples.ShowAndHideLayer),
      new ExampleItem('Change Layer Color', MaplibreExamples.ChangeLayerColor),
      new ExampleItem('Source Layer Visiblity', MaplibreExamples.SourceLayerVisibility),
      new ExampleItem('Style JSON', MaplibreExamples.StyleJson),
      new ExampleItem('Set Tint Color', MaplibreExamples.SetTintColor),
    ]),
    new ExampleGroup('Camera', [
      new ExampleItem('Fit (Bounds, Center/Zoom, Padding)', MaplibreExamples.Fit),
      new ExampleItem('Set Pitch', MaplibreExamples.SetPitch),
      new ExampleItem('Set Heading', MaplibreExamples.SetHeading),
      new ExampleItem('Fly To', MaplibreExamples.FlyTo),
      new ExampleItem('Restrict Bounds', MaplibreExamples.RestrictMapBounds),
      new ExampleItem('Set User Tracking Modes', MaplibreExamples.SetUserTrackingModes),
      new ExampleItem('Yo Yo Camera', MaplibreExamples.YoYo),
      new ExampleItem('Take Snapshot Without Map', MaplibreExamples.TakeSnapshot),
      new ExampleItem('Take Snapshot With Map', MaplibreExamples.TakeSnapshotWithMap),
      new ExampleItem('Get Current Zoom', MaplibreExamples.GetZoom),
      new ExampleItem('Get Center', MaplibreExamples.GetCenter),
      new ExampleItem('Compass View', MaplibreExamples.CompassView),
    ]),
    new ExampleGroup('User Location', [
      new ExampleItem(
        'Set User Location Vertical Alignment',
        MaplibreExamples.SetUserLocationVerticalAlignment,
      ),
      new ExampleItem('User Location Updates', MaplibreExamples.UserLocationChange),
      new ExampleItem('Set Displacement', MaplibreExamples.SetDisplacement),
      new ExampleItem(
        'Set User Location Render Mode',
        MaplibreExamples.SetUserLocationRenderMode,
      ),
      new ExampleItem('Set Preferred Frames Per Second (Android only)', MaplibreExamples.SetAndroidPreferredFramesPerSecond),
    ]),
    new ExampleGroup('Symbol/CircleLayer', [
      new ExampleItem('Custom Icon', MaplibreExamples.CustomIcon),
      new ExampleItem('Clustering Earthquakes', MaplibreExamples.EarthQuakes),
      new ExampleItem('Shape Source From Icon', MaplibreExamples.ShapeSourceIcon),
      new ExampleItem('Data Driven Circle Colors', MaplibreExamples.DataDrivenCircleColors),
    ]),
    new ExampleGroup('Fill/RasterLayer', [
      new ExampleItem('GeoJSON Source', MaplibreExamples.GeoJSONSource),
      new ExampleItem('Watercolor Raster Tiles', MaplibreExamples.WatercolorRasterTiles),
      new ExampleItem('Indoor Building Map', MaplibreExamples.IndoorBuilding),
      new ExampleItem('Query Feature Point', MaplibreExamples.QueryAtPoint),
      new ExampleItem('Query Features Bounding Box', MaplibreExamples.QueryWithRect),
      new ExampleItem('Custom Vector Source', MaplibreExamples.CustomVectorSource),
      new ExampleItem('Image Overlay', MaplibreExamples.ImageOverlay),
      new ExampleItem('Animated Image Overlay', MaplibreExamples.AnimatedImageOverlay),
      new ExampleItem(
        'Choropleth Layer By Zoom Level',
        MaplibreExamples.ChoroplethLayerByZoomLevel,
      ),
    ]),
    new ExampleGroup('LineLayer', [
      new ExampleItem('GradientLine', MaplibreExamples.GradientLine),
    ]),
    new ExampleGroup('Annotations', [
      new ExampleItem('Show Point Annotation', MaplibreExamples.ShowPointAnnotation),
      new ExampleItem('Point Annotation Anchors', MaplibreExamples.PointAnnotationAnchors),
      new ExampleItem('Marker View', MaplibreExamples.MarkerView),
      new ExampleItem('Heatmap', MaplibreExamples.Heatmap),
      new ExampleItem('Custom Callout', MaplibreExamples.CustomCallout),
    ]),
    new ExampleGroup('Animations', [
      new ExampleItem('Animated Line', MaplibreExamples.AnimatedLine),
      new ExampleItem('Animation Along a Line', MaplibreExamples.DriveTheLine),
    ]),
    new ExampleItem('Cache management', MaplibreExamples.CacheManagement),
  ],
  true,
);

function FlatMapExamples(example, flattenedExamples = []) {
  if (example instanceof ExampleGroup) {
    return [
      ...flattenedExamples,
      ...example.items.flatMap(e => FlatMapExamples(e)),
      example,
    ];
  }
  return [...flattenedExamples, example];
}

const FlatExamples = FlatMapExamples(Examples);

function ExampleList({route, navigation}) {
  const {name} = route;
  const example = FlatExamples.find(e => e.label === name) || Examples;

  const back = !example.root
    ? {
        onBack: () => {
          navigation.goBack();
        },
      }
    : {};

  function itemPress(item) {
    navigation.navigate(item.label);
  }

  function renderItem({item}) {
    return (
      <View style={styles.exampleListItemBorder}>
        <TouchableOpacity onPress={() => itemPress(item)}>
          <View style={styles.exampleListItem}>
            <Text style={styles.exampleListLabel}>{item.label}</Text>
            <Icon name="keyboard-arrow-right" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={sheet.matchParent}>
      <MapHeader label={example.label} {...back} />
      <View style={sheet.matchParent}>
        <FlatList
          style={styles.exampleList}
          data={example.items}
          keyExtractor={item => item.label}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

ExampleList.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

function buildNavigationScreens(example, Stack) {
  if (example instanceof ExampleGroup) {
    return (
      <Stack.Screen
        key={example.label}
        name={example.label}
        component={ExampleList}
      />
    );
  }
  return (
    <Stack.Screen
      key={example.label}
      name={example.label}
      component={example.Component}
    />
  );
}

function Home() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Examples.label}
        screenOptions={{
          headerShown: false,
          transitionSpec: TransitionPresets.SlideFromRightIOS.transitionSpec,
        }}>
        {FlatExamples.map(example => buildNavigationScreens(example, Stack))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Home;
