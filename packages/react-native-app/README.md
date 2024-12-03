# MapLibre React Native Example App

This is an app to demonstrate the possibilities of `@maplibre/maplibre-react-native` within React Native.

> [!NOTE]
> This app is configured through a monorepo for easy native development of the library. Follow the [Getting Started](/docs/guides/GettingStarted.md) guide for regular installation steps.

## Development Setup

1. Install all monorepo dependencies by running `yarn install` from the root directory
2. Switch to the `packages/react-native-app` directory
3. Run `yarn pod:install` to install Pods for iOS
4. Start React Native Dev Server `yarn start`
5. Press one of the following keys:
   - `a` for building and running Android
   - `i` for building and running iOS

After you've built a development client, you can use `yarn start` to just reload the apps without another native build.

## Clean Builds

- If you want a clean build, run `yarn purge`, which will run:
  - `yarn purge:js`
  - `yarn purge:android`
  - `yarn purge:ios`

## Building from IDEs

It's also possible to build and run from Android Studio and Xcode.

- Android: Open the `packages/react-native-app/android` directory with Android Studio
- iOS: Open the `packages/react-native-app/ios/MapLibreReactNativeExample.xcworkspace` workspace with Xcode
