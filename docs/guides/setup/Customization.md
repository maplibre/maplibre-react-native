# Setup Customization

It's possible to customize the native setup of the library. These props/options must be applied differently, based on
your project:

## Expo

If you are using Expo, simply add the customizations in the projects `app.json` or `app.config.{js,ts}`. Here is an
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
          // Android Plugin Props
        },
        ios: {
          // iOS Plugin Props
        },
      } as MapLibrePluginProps,
    ],
  ],
});
```

## React Native

If you are using React Native, the customizations have to be applied differently for each platform.

On Android they are set in the `gradle.properties`, each of them prefixed with `org.maplibre.reactnative`. Example:

```diff
+ org.maplibre.reactnative.nativeVersion=x.x.x
```

On iOS global variables in the `Podfile` are used, prefixed with `$MLRN`.

```diff
+ $MLRN_NATIVE_VERSION="x.x.x"
```

## Android

| Plugin Prop                                 | `gradle.properties` Key                                      | Type                    | Description                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `android.nativeVersion`                     | `org.maplibre.reactnative.nativeVersion`                     | `VersionString`         | Version for [`org.maplibre.gl:android-sdk`](https://mvnrepository.com/artifact/org.maplibre.gl/android-sdk) |
| `android.pluginVersion`                     | `org.maplibre.reactnative.pluginVersion`                     | `VersionString`         | Version for `org.maplibre.gl:android-plugin-*-v9`                                                           |
| `android.turfVersion`                       | `org.maplibre.reactnative.turfVersion`                       | `VersionString`         | Version for `org.maplibre.gl:android-sdk-turf`                                                              |
| `android.okhttpVersion`                     | `org.maplibre.reactnative.okhttpVersion`                     | `VersionString`         | Version for `com.squareup.okhttp3:okhttp`                                                                   |
| `android.locationEngine`                    | `org.maplibre.reactnative.locationEngine`                    | `"default" \| "google"` | [Location engine to be used](#choosing-a-location-engine)                                                   |
| `android.googlePlayServicesLocationVersion` | `org.maplibre.reactnative.googlePlayServicesLocationVersion` | `VersionString`         | Version for `com.google.android.gms:play-services-location`, only used with `locationEngine: "google"`      |

For default values see [`gradle.properties` of the library](/android/gradle.properties).

### Choosing a Location Engine

You can choose between the following two location engines on Android:

- `default`
  - Default location engine provided by the device
  - Doesn't work with emulator
  - F-Droid compatible
- `google`
  - Google Play Services Location Engine
  - Possibly more accurate
  - Works with emulator
  - Not F-Droid compatible

## iOS

| Plugin Prop         | `Podfile` Global Variable | Type            | Description                                                                                                           |
| ------------------- | ------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ios.nativeVersion` | `$MLRN_NATIVE_VERSION`    | `VersionString` | Version for [`maplibre-gl-native-distribution`](https://github.com/maplibre/maplibre-gl-native-distribution/releases) |
| `ios.spmSpec`       | `$MLRN_SPM_SPEC`          | `string`        | [Swift Package Manager Spec](#setting-a-spm-spec)                                                                     |

For default values see [`maplibre-react-native.podspec` of the library](/maplibre-react-native.podspec).

### Setting a SPM Spec

Setting a Swift Package Manager Spec allows more customization thn

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
