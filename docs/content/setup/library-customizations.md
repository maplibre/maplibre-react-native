---
sidebar_position: 3
---

# Library Customizations

It's possible to customize the native setup of the library. These props must be applied differently, based on
the project setup.

## Expo

When using Expo, simply add the customizations in the projects `app.json` or `app.config.{js,ts}`. Here is an
example customization for in a `app.config.ts`:

```ts
import type { MapLibrePluginProps } from "@maplibre/maplibre-react-native";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  plugins: [
    [
      "@maplibre/maplibre-react-native",
      {
        android: {
          nativeVersion: "x.x.x",
        },
        ios: {
          nativeVersion: "x.x.x",
        },
      } as MapLibrePluginProps,
    ],
  ],
});
```

## React Native

When using React Native, the customizations have to be applied differently for each platform.

On Android they are set in the `gradle.properties`, each of them prefixed with `org.maplibre.reactnative`. Example:

```diff
+ org.maplibre.reactnative.nativeVersion=x.x.x
```

On iOS global variables in the `Podfile` are used, prefixed with `$MLRN`.

```diff
+ $MLRN_NATIVE_VERSION="x.x.x"

target "AppName" do
```

## Available Customizations

### Android

| Prop Key                            | Type                    | Description                                                                                                 |
| ----------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `nativeVersion`                     | `VersionString`         | Version for [`org.maplibre.gl:android-sdk`](https://mvnrepository.com/artifact/org.maplibre.gl/android-sdk) |
| `pluginVersion`                     | `VersionString`         | Version for `org.maplibre.gl:android-plugin-*-v9`                                                           |
| `turfVersion`                       | `VersionString`         | Version for `org.maplibre.gl:android-sdk-turf`                                                              |
| `okhttpVersion`                     | `VersionString`         | Version for `com.squareup.okhttp3:okhttp`                                                                   |
| `locationEngine`                    | `"default" \| "google"` | [Location engine to be used](#location-engine)                                                              |
| `googlePlayServicesLocationVersion` | `VersionString`         | Version for `com.google.android.gms:play-services-location`, only used with `locationEngine: "google"`      |

For default values see [`gradle.properties` of the library](https://github.com/maplibre/maplibre-react-native/tree/main/android/gradle.properties).

#### Location Engine

Two location engines are available on Android:

- `default`
  - Default location engine provided by the device
  - Doesn't work with emulator
  - F-Droid compatible
- `google`
  - Google Play Services Location Engine
  - Possibly more accurate
  - Works with emulator
  - Not F-Droid compatible

### iOS

| Prop Key        | `Podfile` Global Variable | Type            | Description                                                                                                           |
| --------------- | ------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `nativeVersion` | `$MLRN_NATIVE_VERSION`    | `VersionString` | Version for [`maplibre-gl-native-distribution`](https://github.com/maplibre/maplibre-gl-native-distribution/releases) |
| `spmSpec`       | `$MLRN_SPM_SPEC`          | `string`        | [Swift Package Manager Spec](#spm-spec)                                                                               |

For default values see [`maplibre-react-native.podspec` of the library](https://github.com/maplibre/maplibre-react-native/blob/main/maplibre-react-native.podspec).

#### SPM Spec

Setting a Swift Package Manager Spec allows further customization over setting the native version:

```rb
$MLRN_SPM_SPEC = {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "upToNextMajorVersion",
    minimumVersion: "x.x.x"
  },
  product_name: "MapLibre"
}
```
