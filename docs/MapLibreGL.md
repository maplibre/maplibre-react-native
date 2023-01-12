## MapLibreGL
###

### methods
#### setAccessToken(accessToken)

##### arguments
| Name | Type | Required | Description  |
| ---- | :--: | :------: | :----------: |
| `accessToken` | `String` | `Yes` | access token to pull Mapbox-hosted tiles; can be `null` for other tile hosts |

##### Description
sets the accessToken, which is required when you want to use mapbox tiles
not required when using other tiles

#### getAccessToken()

##### arguments
| Name | Type | Required | Description  |
| ---- | :--: | :------: | :----------: |
| `accessToken` | `String` | `Yes` | access token to pull Mapbox-hosted tiles; can be `null` if for other tile hosts |

##### Description
gets the accessToken


#### addCustomHeader(headerName, headerValue)

##### arguments
| Name | Type | Required | Description  |
| ---- | :--: | :------: | :----------: |
| `headerName` | `String` | `Yes` | name for customHeader |
| `headerValue` | `String` | `Yes` | value for customHeader |

##### Description
also see [CustomHttpHeaders](/docs/CustomHttpHeaders.md)


#### removeCustomHeader(headerName)

##### arguments
| Name | Type | Required | Description  |
| ---- | :--: | :------: | :----------: |
| `headerName` | `String` | `Yes` | name of customHeader to be removed |

##### Description
also see [CustomHttpHeaders](/docs/CustomHttpHeaders.md)


### Android only
#### requestAndroidLocationPermissions()
##### Description
Opens Android Location Permission prompt.
Returns a Promise which resolves into a boolean.
Either permission was granted or denied.


#### setConnected(connected)
##### arguments
| Name | Type | Required | Description  |
| ---- | :--: | :------: | :----------: |
| `connected` | `Boolean` | `Yes` | whether or not the SDK should assume it is online |

#### Description
If you want to fully block map tile requests over the network, such as for a low-data / offline application.
