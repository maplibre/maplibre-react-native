# MLRNModule

## Methods

### `addCustomHeader(headerName, headerValue)`

See [Custom HTTP Headers](../guides/custom-http-headers.md)

#### Arguments

| Name          |   Type   | Required | Description            |
| ------------- | :------: | :------: | ---------------------- |
| `headerName`  | `string` |  `Yes`   | name for customHeader  |
| `headerValue` | `string` |  `Yes`   | value for customHeader |

### `removeCustomHeader(headerName)`

See [Custom HTTP Headers](../guides/custom-http-headers.md)

#### Arguments

| Name         |   Type   | Required | Description                        |
| ------------ | :------: | :------: | ---------------------------------- |
| `headerName` | `string` |  `Yes`   | name of customHeader to be removed |

### `requestAndroidLocationPermissions()`

Android only, opens Location Permission prompt. Returns a Promise which resolves into a boolean. Either permission was
granted or denied.

### `setConnected(connected)`

Manually sets the connectivity state of the app. This is useful for apps which control their own connectivity state and
want to bypass any checks to the `ConnectivityManager`. Set to `true` for connected, `false` for disconnected,
and `null` for the `ConnectivityManager` to determine.

If hosting styles/sources on `localhost`, it's necessary to bypass `ConnectivityManager` when the device is
offline ([maplibre/maplibre-react-native#21](https://github.com/maplibre/maplibre-react-native/issues/21#issuecomment-2558602006), [mapbox/mapbox-gl-native#12819](https://github.com/mapbox/mapbox-gl-native/issues/12819)):

```ts
setConnected(true);
```

For a low-data/offline app it's possible to block all style/source requests via network:

```ts
setConnected(false);
```

#### Arguments

| Name        |   Type    | Required | Description                                               |
| ----------- | :-------: | :------: | --------------------------------------------------------- |
| `connected` | `boolean` |  `Yes`   | Whether or not MapLibre Native should assume it is online |
