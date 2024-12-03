# MapLibre Expo Example App

This is an app to demonstrate the possibilities of `@maplibre/maplibre-react-native` within Expo.

> [!NOTE]
> This app is configured through a monorepo for easy native development of the library. Follow the [Getting Started](/docs/guides/setup/GettingStarted.md) guide for regular installation steps.

## Development Setup

1. Install all monorepo dependencies by running `yarn install` from the root directory
2. Switch to the `packages/expo-app` directory
3. Build and run a platform:
   - `yarn android` for building and running Android
   - `yarn ios` for building and running iOS

After you've built a development client, you can use `yarn start` to just reload the apps without another native build.
