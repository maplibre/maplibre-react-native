---
sidebar_position: 0
---

# Getting Started

This guide gets you started with MapLibre in your Expo or React Native project.

## Native Versions

This package wraps MapLibre Native for Android and iOS, these are the currently used versions:

<dl>
    <dt>Android</dt>
    <dd>
      <a href="https://github.com/maplibre/maplibre-native/releases/tag/android-v12.2.3">12.2.3</a>
    </dd>
    <dt>iOS</dt>
    <dd>
      <a href="https://github.com/maplibre/maplibre-native/releases/tag/ios-v6.22.1">6.22.1</a>
    </dd>
</dl>

## Requirements

<dl>
  <dt>React Native</dt>
  <dd>≥ 0.74.0 (lower versions might work)</dd>
  <dt>Architecture</dt>
  <dd>From v11 onwards only the new architecture is supported</dd>
  <dt>Android API Level</dt>
  <dd>≥ 23</dd>
  <dt>Map Style/Tiles</dt>
  <dd>
    <ul>
      <li>For development the <a href="https://github.com/maplibre/demotiles">MapLibre Demo Tiles</a> are used</li>
      <li>For production use, please provide your own style/tiles or use a provider like Stadia Maps or MapTiler</li>
    </ul>
  </dd>
</dl>

## Installation

Installing the `@maplibre/maplibre-react-native` package differs for Expo and bare React Native projects. Please follow
the guide corresponding to your app setup:

- [Expo](expo.md)
- [React Native](react-native.md)

## Rendering a `<Map />`

After completing the installation and rebuilding the app, you can start using the library:

```tsx
import React from "react";
import { Map } from "@maplibre/maplibre-react-native";

function App() {
  return <Map mapStyle="https://demotiles.maplibre.org/style.json" />;
}
```
