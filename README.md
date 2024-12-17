[![MapLibre Logo](https://maplibre.org/img/maplibre-logo-big.svg)](https://maplibre.org)

# MapLibre React Native
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Version](https://img.shields.io/npm/v/@maplibre/maplibre-react-native)](https://www.npmjs.com/package/@maplibre/maplibre-react-native)
[![Actions](https://img.shields.io/github/actions/workflow/status/maplibre/maplibre-react-native/review.yml?label=Actions
)](https://github.com/maplibre/maplibre-react-native/actions/workflows/review.yml)


_React Native library for creating maps with [MapLibre Native for Android & iOS](https://github.com/maplibre/maplibre-gl-native)_.

This project originated as a fork of [rnmapbox](https://github.com/rnmapbox/maps), a community-maintained
React Native library for building maps with the Mapbox iOS and Android mobile SDKs. The original product
supported both Mapbox and MapLibre for some time, but as the MapLibre and Mapbox SDKs have
diverged, it has become necessary to separate the projects into specific wrappers by underlying renderer.

<p align="center">
    <img src="/docs/assets/device-android.png"
         alt="Indoor Building Map Android"
         height="320"
          />
    <img src="/docs/assets/device-ios.png"
         alt="Indoor Building Map iOS"
         height="320"
          />
</p>

## Documentation

- [Getting Started](/docs/guides/setup/GettingStarted.md)
- Installation
  - React Native  
    - [Android](/docs/guides/setup/Android.md)
    - [iOS](/docs/guides/setup/iOS.md)
  - [Expo](/docs/guides/setup/Expo.md)
- Migrations
  - [Migrating to v10](/docs/guides/migrations/v10.md)

### Components

- [MapView](/docs/components/MapView.md)
- [Light](/docs/components/Light.md)
- [PointAnnotation](/docs/components/PointAnnotation.md)
- [MarkerView](/docs/components/MarkerView.md)
- [Callout](/docs/components/Callout.md)
- [Camera](/docs/components/Camera.md)
- [UserLocation](/docs/components/UserLocation.md)
- [Images](/docs/components/Images.md)

### Sources

- [VectorSource](/docs/components/VectorSource.md)
- [ShapeSource](/docs/components/ShapeSource.md)
- [RasterSource](/docs/components/RasterSource.md)

### Layers

- [BackgroundLayer](/docs/components/BackgroundLayer.md)
- [CircleLayer](/docs/components/CircleLayer.md)
- [FillExtrusionLayer](/docs/components/FillExtrusionLayer.md)
- [FillLayer](/docs/components/FillLayer.md)
- [LineLayer](/docs/components/LineLayer.md)
- [RasterLayer](/docs/components/RasterLayer.md)
- [SymbolLayer](/docs/components/SymbolLayer.md)
- [HeatmapLayer](/docs/components/HeatmapLayer.md)

### Modules

- [OfflineManager](/docs/modules/offlineManager.md)
- [SnapshotManager](/docs/modules/snapshotManager.md)

### Misc

- [MapLibreGL](/docs/guides/MapLibreGL.md)
- [Custom HTTP Headers](/docs/guides/CustomHTTPHeaders.md)
- [Logger](/docs/guides/Logger.md)

## Contributing & Development

Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide in order to get familiar with how we do things around here and
set up your local development environment.

## Community

Join the `#maplibre-react-native` or `#maplibre` [Slack channels at OSMUS](https://slack.openstreetmap.us/).
