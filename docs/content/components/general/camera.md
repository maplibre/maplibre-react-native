---
# DO NOT MODIFY
# This file is auto-generated from src/components/camera/Camera.tsx
sidebar_label: Camera
---

# `<Camera />`

_Also accepts props from: `BaseProps`, `Partial`_

## Props

### `initialViewState`

Default view settings applied on camera

**Type:** `InitialViewState` | **Required:** No

### `minZoom`

Minimum zoom level of the map

**Type:** `number` | **Required:** No

### `maxZoom`

Maximum zoom level of the map

**Type:** `number` | **Required:** No

### `maxBounds`

Restrict map panning so that the center is within these bounds

**Type:** `LngLatBounds` | **Required:** No

### `trackUserLocation`

The mode used to track the user location on the map:

- undefined: The user's location is not tracked
- "default": Centers the user's location
- "heading": Centers the user's location and uses the compass for bearing
- "course": Centers the user's location and uses the direction of travel for
  bearing

**Type:** `TrackUserLocation` | **Required:** No | **Default:** `undefined`

### `onTrackUserLocationChange`

Triggered when `trackUserLocation` changes

**Type:** `(       event: NativeSyntheticEvent<TrackUserLocationChangeEvent>,     ) => void` | **Required:** No

### `ref`

Ref to access Camera methods.

**Type:** `Ref<CameraRef>` | **Required:** No

## Ref Methods

### `jumpTo(options)`

Map camera will move to new coordinates at the same zoom level

#### Arguments

| Name      | Type                                  | Required | Description |
| :-------- | :------------------------------------ | :------- | :---------- |
| `options` | `CameraCenterOptions & CameraOptions` | Yes      |             |

**cameraRef.current?.easeTo([lng, lat], 200) // eases camera to new location based on duration
cameraRef.current?.easeTo([lng, lat]) // snaps camera to new location without any easing**

### `easeTo(options)`

Map camera will move to new coordinates at the same zoom level

#### Arguments

| Name      | Type                                                           | Required | Description |
| :-------- | :------------------------------------------------------------- | :------- | :---------- |
| `options` | `CameraCenterOptions & CameraOptions & CameraAnimationOptions` | Yes      |             |

**cameraRef.current?.easeTo([lng, lat], 200) // eases camera to new location based on duration
cameraRef.current?.easeTo([lng, lat]) // snaps camera to new location without any easing**

### `flyTo(options)`

Map camera will fly to new coordinate

#### Arguments

| Name      | Type                                                           | Required | Description |
| :-------- | :------------------------------------------------------------- | :------- | :---------- |
| `options` | `CameraCenterOptions & CameraOptions & CameraAnimationOptions` | Yes      |             |

**cameraRef.current?.flyTo([lng, lat])
cameraRef.current?.flyTo([lng, lat], 12000)**

### `fitBounds(bounds, [options])`

Map camera transitions to fit provided bounds

#### Arguments

| Name      | Type                                     | Required | Description |
| :-------- | :--------------------------------------- | :------- | :---------- |
| `bounds`  | `LngLatBounds`                           | Yes      |             |
| `options` | `CameraOptions & CameraAnimationOptions` | No       |             |

**cameraRef.current?.fitBounds([west, south, east, north])
cameraRef.current?.fitBounds([west, south, east, north], top: 20, right: 20, bottom: 20, left: 20 , 1000)**

### `zoomTo(zoom, [options])`

Map camera will zoom to specified level

#### Arguments

| Name      | Type                                     | Required | Description                                     |
| :-------- | :--------------------------------------- | :------- | :---------------------------------------------- |
| `zoom`    | `number`                                 | Yes      | Zoom level that the map camera will animate too |
| `options` | `CameraOptions & CameraAnimationOptions` | No       | Options                                         |

**cameraRef.current?.zoomTo(16)
cameraRef.current?.zoomTo(16, 100)**

### `setStop(stop)`

Map camera will perform updates based on provided config. Advanced use only!

#### Arguments

| Name   | Type         | Required | Description           |
| :----- | :----------- | :------- | :-------------------- |
| `stop` | `CameraStop` | Yes      | Array of Camera stops |

**Returns:** `Promise<void>`

```ts
cameraRef.current?.setStop({
  centerCoordinate: [lng, lat],
  zoomLevel: 16,
  duration: 2000,
});
```

```ts
cameraRef.current?.setStop({
  stops: [
    { pitch: 45, duration: 200 },
    { heading: 180, duration: 300 },
  ],
});
```
