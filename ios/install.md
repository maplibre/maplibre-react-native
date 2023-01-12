# iOS Installation

The following assumes, that you're using autolinking and installed
`@maplibre/maplibre-react-native` via `npm` or `yarn`.

Add the following to your `ios/Podfile`:

```ruby
  post_install do |installer|
    ... other post install hooks
    $RNMBGL.post_install(installer)
  end
```

Running `pod install` will add version `5.13.0` of the MapLibre SDK.

```sh
# Go to the ios directory
cd ios

# Run Pod Install
pod install
```

You are good to go!

## Note on iOS Simulator issues

MapLibre GL Native has some issues on iOS Simulators in many
environments. The map either does not render at all or appears garbled when panning and zooming.
It is best to test on a real device if at all possible at this time
until this is fixed upstream. iOS devs can open the workspace in Xcode and run from there.


## Installing a specific version

The current default MapLibre version is `5.13.0`.
If you want to install a different version, you can override as follows in
your `Podfile`:

```ruby
$RNMBGL_Use_SPM = {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "upToNextMajorVersion",
    minimumVersion: "5.13.0"
  },
  product_name: "Mapbox"
}
```
