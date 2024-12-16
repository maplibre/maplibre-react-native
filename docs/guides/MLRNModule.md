# MLRNModule

## Methods

### `setAccessToken(accessToken)`

sets the accessToken, which is required when you want to use mapbox tiles
not required when using other tiles

#### Arguments

| Name          |   Type   | Required |                                 Description                                  |
| ------------- | :------: | :------: | :--------------------------------------------------------------------------: |
| `accessToken` | `String` |  `Yes`   | access token to pull Mapbox-hosted tiles; can be `null` for other tile hosts |

### `getAccessToken()`

gets the accessToken

#### Arguments

| Name          |   Type   | Required |                                   Description                                   |
| ------------- | :------: | :------: | :-----------------------------------------------------------------------------: |
| `accessToken` | `String` |  `Yes`   | access token to pull Mapbox-hosted tiles; can be `null` if for other tile hosts |

### `addCustomHeader(headerName, headerValue)`

#### Arguments

also see [Custom HTTP Headers](/docs/guides/CustomHTTPHeaders.md)

| Name          |   Type   | Required |      Description       |
| ------------- | :------: | :------: | :--------------------: |
| `headerName`  | `String` |  `Yes`   | name for customHeader  |
| `headerValue` | `String` |  `Yes`   | value for customHeader |

### `removeCustomHeader(headerName)`

Also see [Custom HTTP Headers](/docs/guides/CustomHTTPHeaders.md)

#### Arguments

| Name         |   Type   | Required |            Description             |
| ------------ | :------: | :------: | :--------------------------------: |
| `headerName` | `String` |  `Yes`   | name of customHeader to be removed |

### `requestAndroidLocationPermissions()`

Android only, opens Location Permission prompt. Returns a Promise which resolves into a boolean. Either permission was granted or denied.

### `setConnected(connected)`

If you want to fully block map tile requests over the network, such as for a low-data / offline application.

#### arguments

| Name        |   Type    | Required |                    Description                    |
| ----------- | :-------: | :------: | :-----------------------------------------------: |
| `connected` | `Boolean` |  `Yes`   | whether or not the SDK should assume it is online |
