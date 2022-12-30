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

[![npm version](https://badge.fury.io/js/%40maplibre%2Fmaplibre-react-native.svg)](https://badge.fury.io/js/%40maplibre%2Fmaplibre-react-native)  
[![Android Build](https://github.com/maplibre/maplibre-react-native/actions/workflows/android-actions.yml/badge.svg)](https://github.com/maplibre/maplibre-react-native/actions/workflows/android-actions.yml)  
[![iOS Build](https://github.com/maplibre/maplibre-react-native/actions/workflows/ios-actions.yml/badge.svg)](https://github.com/maplibre/maplibre-react-native/actions/workflows/ios-actions.yml)  

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

## Documentation

[Getting Started (start here)](/docs/GettingStarted.md)

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

## Contributing / local development

Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide in order to get familiar with how we do things around here and
set up your local dev environment.

## Community

Join the #maplibre-native Slack channel at OSMUS: get an invite at https://slack.openstreetmap.us/
