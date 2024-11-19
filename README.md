[![MapLibre Logo](https://maplibre.org/img/maplibre-logo-big.svg)](https://maplibre.org)

# MapLibre React Native

_React Native library for creating maps with [MapLibre Native for Android & iOS](https://github.com/maplibre/maplibre-gl-native)_.

This project originated as a fork of [rnmapbox](https://github.com/rnmapbox/maps), a community-maintained
React Native library for building maps with the Mapbox iOS and Android mobile SDKs. The original product
supported both Mapbox and MapLibre for some time, but as the MapLibre and Mapbox SDKs have
diverged, it has become necessary to separate the projects into specific wrappers by underlying renderer.

---

[![npm version](https://badge.fury.io/js/%40maplibre%2Fmaplibre-react-native.svg)](https://badge.fury.io/js/%40maplibre%2Fmaplibre-react-native) [![Android Build](https://github.com/maplibre/maplibre-react-native/actions/workflows/android-actions.yml/badge.svg)](https://github.com/maplibre/maplibre-react-native/actions/workflows/android-actions.yml) [![iOS Build](https://github.com/maplibre/maplibre-react-native/actions/workflows/ios-actions.yml/badge.svg)](https://github.com/maplibre/maplibre-react-native/actions/workflows/ios-actions.yml)

---

<br>

<img src="/docs/assets/indoor-building-map-android.png"
     alt="Indoor Building Map Android"
     height="300"
      />
<img src="/docs/assets/indoor-building-map-ios.png"
     alt="Indoor Building Map iOS"
     height="300"
      />

## Documentation

- [Getting Started](/docs/GettingStarted.md)
- Installation
  - React Native  
    - [Android](/android/install.md)
    - [iOS](/ios/install.md)
  - [Expo](/plugin/install.md)

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

- [MapLibreGL](/docs/MapLibreGL.md)
- [CustomHttpHeaders](/docs/CustomHttpHeaders.md)
- [Logger](/docs/Logger.md)

## Contributing / local development

Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide in order to get familiar with how we do things around here and
set up your local development environment.

## Community

Join the `#maplibre-react-native` or `#maplibre` [Slack channels at OSMUS](https://slack.openstreetmap.us/).
