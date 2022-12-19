# iOS Installation

The following assumes, that you're using autolinking and installed


`@maplibre/maplibre-react-native` via `npm` or `yarn`.

Add the following to your `ios/Podfile`:

```ruby
  post_install do |installer|
    $RNMBGL.post_install(installer)
    ... other post install hooks
  end
```

Running `pod install` will add version `5.12.2` of the MapLibre SDK.

```sh
# Go to the ios folder
cd ios

# Run Pod Install
pod install
```

You are good to go!

## Installing a specific version

The current default MapLibre version is `5.12.2`.
If you want to install a different version, you can override as follows in
your `Podfile`:

```ruby
$RNMBGL_Use_SPM = {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "upToNextMajorVersion",
    minimumVersion: "5.12.2"
  },
  product_name: "Mapbox"
}
```
