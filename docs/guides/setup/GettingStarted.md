# Getting Started

This quickstart guide provides a zero-to-map intro using React Native. From there you can check out the
[examples](/packages/examples) folder if you want to jump in the deep end.

## Prerequisites

1. On Android we support API 23 and higher
2. You will need a vector tile source (such as Stadia Maps or MapTiler) for production use; a demonstration URL is used in the below example.

## Dependencies

- [node](https://nodejs.org)
- [npm](https://www.npmjs.com/)
- [React Native](https://facebook.github.io/react-native/) (0.60+)

## Installation

### Set up a React Native project

If you don't have an existing React Native project, create one:

```shell
npx react-native init MyApp
```

### Install Package

From your React Native project's root directory, add the package via
either `yarn` or `npm` (pick one).

```shell
# install with Yarn
yarn add @maplibre/maplibre-react-native

```

```shell
# install with NPM
npm install @maplibre/maplibre-react-native --save
```

### Review platform specific Details

Check out the installation guide(s) for additional information about platform-specific setup, quirks,
and steps required before running.

- [Android](/docs/guides/setup/Android.md)
- [iOS](/docs/guides/setup/iOS.md)
- [Expo](/docs/guides/setup/Expo.md)

## Adding a map

Here is an example minimal `App.tsx`:

```tsx
import React from "react";
import { MapView, setAccessToken } from "@maplibre/maplibre-react-native";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
setAccessToken(null);

function App() {
  return <MapView style={{ flex: 1 }} />;
}
```

## Run it!

### iOS

```shell
# Run with yarn
yarn run ios

# or Run with NPM
npm run ios
```

### Android

```shell
# Run with yarn
yarn run android

# or Run with NPM
npm run android
```
