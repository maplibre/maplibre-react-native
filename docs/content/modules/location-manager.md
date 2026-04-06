---
# DO NOT MODIFY
# This file is auto-generated from src/modules/location/LocationManager.ts
sidebar_label: LocationManager
---

# LocationManager

## Methods

### `getCurrentPosition()`

**Returns:** `Promise<GeolocationPosition | undefined>`

### `addListener(newListener)`

#### Arguments

| Name          | Type                                      | Required | Description |
| :------------ | :---------------------------------------- | :------- | :---------- |
| `newListener` | `(location: GeolocationPosition) => void` | Yes      |             |

### `removeListener(oldListener)`

#### Arguments

| Name          | Type                                      | Required | Description |
| :------------ | :---------------------------------------- | :------- | :---------- |
| `oldListener` | `(location: GeolocationPosition) => void` | Yes      |             |

### `removeAllListeners()`

### `start()`

### `stop()`

### `setMinDisplacement(minDisplacement)`

#### Arguments

| Name              | Type     | Required | Description |
| :---------------- | :------- | :------- | :---------- |
| `minDisplacement` | `number` | Yes      |             |

### `requestPermissions()`

Request location permissions
Requests the following:

- Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
- iOS: `requestWhenInUseAuthorization`

**Returns:** `Promise<boolean>` — Promise resolves to true if permissions were granted, false otherwise
