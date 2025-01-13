---
sidebar_position: 2
---
# React Native Setup

First install `@maplibre/maplibre-react-native` with the package manager of your choice, e.g. with `yarn`:

```bash
yarn add @maplibre/maplibre-react-native
```

## Android

Android doesn't need any further specific setup. Simply rebuild your app.

## iOS

On iOS it's necessary to add `$MLRN.post_install(installer)` to the `post_install` block in the `ios/Podfile` is
necessary:

```diff
post_install do |installer|
  # Other post install hooks...
+ $MLRN.post_install(installer)
end
```

Afterward run `pod install` in the `ios` directory:

```bash
cd ios
pod install
```

Now rebuild your app.

## Customzations

You can customize the setup of MapLibre React Native through `gradle.properties` on Android or global variables in the
`Podfile` on iOS. Find out more in the [customization guide](library-customizations.md).
