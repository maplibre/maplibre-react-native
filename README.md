[![MapLibre Logo](https://maplibre.org/img/maplibre-logo-big.svg)](https://maplibre.org)

# MapLibre React Native

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Version](https://img.shields.io/npm/v/@maplibre/maplibre-react-native)](https://www.npmjs.com/package/@maplibre/maplibre-react-native)
[![Actions](https://img.shields.io/github/actions/workflow/status/maplibre/maplibre-react-native/review.yml?label=Actions)](https://github.com/maplibre/maplibre-react-native/actions/workflows/review.yml)

_React Native library for creating maps
with [MapLibre Native for Android & iOS](https://github.com/maplibre/maplibre-gl-native)._

This project originated as a fork of [rnmapbox](https://github.com/rnmapbox/maps), a community-maintained
React Native library for building maps with the Mapbox iOS and Android mobile SDKs. The original product
supported both Mapbox and MapLibre for some time, but as the MapLibre and Mapbox SDKs have
diverged, it has become necessary to separate the projects into specific wrappers by underlying renderer.

<p align="center">
    <img src="/docs/static/screenshots/index/device-android.png"
         alt="Indoor Building Map Android"
         height="320"
          />
    <img src="/docs/static/screenshots/index/device-ios.png"
         alt="Indoor Building Map iOS"
         height="320"
          />
</p>

## Documentation

- [Getting Started](/docs/docs/setup/Getting-Started.md)
- Installation
  - [Expo](/docs/docs/setup/Expo.md)
  - [React Native](/docs/docs/setup/React-Native.md)
- [Customization](/docs/docs/setup/Customization.md)
- Migrations
  - [Migrating to v10](/docs/docs/setup/migrations/v10.md)

### Components

- [MapView](/docs/docs/components/MapView.md)
- [Light](/docs/docs/components/Light.md)
- [PointAnnotation](/docs/docs/components/PointAnnotation.md)
- [MarkerView](/docs/docs/components/MarkerView.md)
- [Callout](/docs/docs/components/Callout.md)
- [Camera](/docs/docs/components/Camera.md)
- [UserLocation](/docs/docs/components/UserLocation.md)
- [Images](/docs/docs/components/Images.md)

### Sources

- [VectorSource](/docs/docs/components/VectorSource.md)
- [ShapeSource](/docs/docs/components/ShapeSource.md)
- [RasterSource](/docs/docs/components/RasterSource.md)

### Layers

- [BackgroundLayer](/docs/docs/components/BackgroundLayer.md)
- [CircleLayer](/docs/docs/components/CircleLayer.md)
- [FillExtrusionLayer](/docs/docs/components/FillExtrusionLayer.md)
- [FillLayer](/docs/docs/components/FillLayer.md)
- [LineLayer](/docs/docs/components/LineLayer.md)
- [RasterLayer](/docs/docs/components/RasterLayer.md)
- [SymbolLayer](/docs/docs/components/SymbolLayer.md)
- [HeatmapLayer](/docs/docs/components/HeatmapLayer.md)

### Modules

- [OfflineManager](/docs/docs/modules/OfflineManager.md)
- [SnapshotManager](/docs/docs/modules/SnapshotManager.md)

### Misc

- [MLRNModule](/docs/docs/modules/MLRNModule.md)
- [Custom HTTP Headers](/docs/docs/guides/Custom-HTTP-Headers.md)
- [Logger](/docs/docs/modules/Logger.md)

## Contributing & Development

Read the [CONTRIBUTING](/CONTRIBUTING.md) guide in order to get familiar with how we do things around here and
set up your local development environment.

## Community

Join the `#maplibre-react-native` or `#maplibre` [on the Open Street Map Slack](https://slack.openstreetmap.us/).
