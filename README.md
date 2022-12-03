---

[![MapLibre Logo](https://maplibre.org/img/maplibre-logo-big.svg)](https://maplibre.org)


# MapLibre GL SDK for React Native

_A React Native library for building maps with   
the [MapLibre GL Native SDK for iOS & Android](https://github.com/maplibre/maplibre-gl-native)_.

This project originated as a fork of [rnmapbox](https://github.com/rnmapbox/maps), a community-maintained
React Native Library for building maps with the Mapbox iOS and Android mobile SDKs. The original product
supported both Mapbox and MapLibre for some time, but as the MapLibre and Mapbox SDKs have
diverged, it has become necessary to separate the projects into specific wrappers by underlying renderer.

**This project is in the process of being onboarded and prepared for broad use by the MapLibre community. PRs and tickets welcomed.** Track the status over at: https://github.com/maplibre/maplibre/issues/134

---

_TODO: update these badges_

[![npm version](https://badge.fury.io/js/%40react-native-mapbox-gl%2Fmaps.svg)](https://badge.fury.io/js/%40react-native-mapbox-gl%2Fmaps)  
[![Android Build](https://github.com/rnmapbox/maps/actions/workflows/android-actions.yml/badge.svg)](https://github.com/rnmapbox/maps/actions/workflows/android-actions.yml)  
[![iOS Build](https://github.com/rnmapbox/maps/actions/workflows/ios-actions.yml/badge.svg)](https://github.com/rnmapbox/maps/actions/workflows/ios-actions.yml)  

---

<br>

<img src="./assets/indoor_building_map_android.png"
     alt="Indoor Building Map Android"
     height="300"
      />
<img src="./assets/indoor_building_map_ios.png"
     alt="Indoor Building Map iOS"
     height="300"
      />

## Prerequisite

1. On Android we support from version 6 (API 23) upwards
2. Please [Sign Up to Mapbox](https://account.mapbox.com/auth/signup/) to get the Mapbox Access Token.


## Dependencies

- [node](https://nodejs.org)
- [npm](https://www.npmjs.com/)
- [React Native](https://facebook.github.io/react-native/) (0.60+)


## Installation

### Step 1 - Install Package:

```sh
# install with Yarn
yarn add @react-native-mapbox-gl/maps


# or install with NPM
npm install @react-native-mapbox-gl/maps --save
```

### Step 2 - Installation Guides:

- [Android](/android/install.md)
- [iOS](/ios/install.md)
- [Expo](/plugin/install.md)
- [Example](/example)


### Getting Started
For more information, check out our [Getting Started](/docs/GettingStarted.md) section

## Run Project
Before you run your project be sure you have completeded the Installation Guides for Android or iOS.

### Run iOS Simulator
```sh
# Run with yarn
yarn run ios

# or Run with NPM
npm run ios
```

### Run Android Emulator
```sh
# Run with yarn
yarn run android

# or Run with NPM
npm run android
```

## Adding a map

```js
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken('<YOUR_ACCESSTOKEN>');

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: 'tomato'
  },
  map: {
    flex: 1
  }
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} />
        </View>
      </View>
    );
  }
}
```

## Documentation

### Components

- [MapView](/docs/MapView.md)
- [Light](/docs/Light.md)
- [StyleSheet](/docs/StyleSheet.md)
- [PointAnnotation](/docs/PointAnnotation.md)
- [MarkerView](/docs/MarkerView.md)
- [Callout](/docs/Callout.md)
- [Camera](docs/Camera.md)
- [UserLocation](docs/UserLocation.md)
- [Images](docs/Images.md)

### Sources

- [VectorSource](/docs/VectorSource.md)
- [ShapeSource](/docs/ShapeSource.md)
- [RasterSource](/docs/RasterSource.md)

### Layers

- [BackgroundLayer](/docs/BackgroundLayer.md)
- [CircleLayer](/docs/CircleLayer.md)
- [FillExtrusionLayer](/docs/FillExtrusionLayer.md)
- [FillLayer](/docs/FillLayer.md)
- [LineLayer](/docs/LineLayer.md)
- [RasterLayer](/docs/RasterLayer.md)
- [SymbolLayer](/docs/SymbolLayer.md)
- [HeatmapLayer](/docs/HeatmapLayer.md)

### Offline

- [OfflineManager](/docs/OfflineManager.md)
- [SnapshotManager](/docs/snapshotManager.md)

### Misc

- [MapboxGL](/docs/MapboxGL.md)
- [CustomHttpHeaders](/docs/CustomHttpHeaders.md)
- [Logger](/docs/Logger.md)

## Expo Support

This package is not available in the [Expo Go](https://expo.io/client) app. Learn how you can use it with [custom dev clients](/plugin/install.md).

## Testing with Jest

This library provides some mocks which are necessary for running tests.

Example:

```json
"jest": {
  "preset": "react-native",
  "setupFilesAfterEnv": ["@react-native-mapbox-gl/maps/setup-jest"]
}
```

## Contribution

### Getting Involved

Join the #maplibre-native Slack channel at OSMUS: get an invite at https://slack.openstreetmap.us/
Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide in order to get familiar with how we do things around here.
