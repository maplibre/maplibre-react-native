# Android Installation

We've set up the default MapLibre dependencies for you, and no
special installation is required!

Feel free to check out the `/example` projects [`android/build.gradle`](https://github.com/maplibre/maplibre-react-native/blob/main/example/)
projects for inspiration to get started.

Note that the Android SDK is slightly peculiar in that it absolutely
requires setting an access token, even though it will be `null` for
most users (non-Mapbox-users). Simply add something like this near
the top of your `App.js`.

```javascript
MapboxGL.setAccessToken(null);
```