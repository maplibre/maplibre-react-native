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

#### `newListener`

**Type:** `(location: GeolocationPosition) => void` | **Required:** Yes

### `removeListener(oldListener)`

#### `oldListener`

**Type:** `(location: GeolocationPosition) => void` | **Required:** Yes

### `removeAllListeners()`

### `start()`

### `stop()`

### `setMinDisplacement(minDisplacement)`

#### `minDisplacement`

**Type:** `number` | **Required:** Yes

### `requestPermissions()`

Request location permissions
Requests the following:

- Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
- iOS: `requestWhenInUseAuthorization`

**Returns:** `Promise<boolean>` — Promise resolves to true if permissions were granted, false otherwise
