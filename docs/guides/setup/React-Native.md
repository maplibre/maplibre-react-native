# React Native Setup

First install `@maplibre/maplibre-react-native` with the package manager of your choice, e.g. with `yarn`:

```shell
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

```shell
cd ios
pod install
```

Now rebuild your app.

### Installing a specific version

If you want to modify the MapLibre Native iOS version, you can override as follows in your `Podfile`:

```rb
$MLRN_SPM_Spec = {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "upToNextMajorVersion",
    minimumVersion: "<Set your version here>"
  },
  product_name: "MapLibre"
}
```
