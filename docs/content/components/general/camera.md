---
# DO NOT MODIFY
# This file is auto-generated from src/components/Camera.tsx
sidebar_label: Camera
---

# `<Camera />`

## Props

| Prop                       |                      Type                       | Default | Required | Description                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | :---------------------------------------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `centerCoordinate`         |               `GeoJSON.Position`                | `none`  | `false`  | The location on which the map should center.                                                                                                                                                                                                                                                                                                      |
| `bounds`                   |            `CameraBoundsWithPadding`            | `none`  | `false`  | The corners of a box around which the map should bound. Contains padding props for backwards<br/>compatibility; the root `padding` prop should be used instead.                                                                                                                                                                                   |
| `heading`                  |                    `number`                     | `none`  | `false`  | The heading (orientation) of the map.                                                                                                                                                                                                                                                                                                             |
| `pitch`                    |                    `number`                     | `none`  | `false`  | The pitch of the map.                                                                                                                                                                                                                                                                                                                             |
| `zoomLevel`                |                    `number`                     | `none`  | `false`  | The zoom level of the map.                                                                                                                                                                                                                                                                                                                        |
| `padding`                  |                 `CameraPadding`                 | `none`  | `false`  | The viewport padding in points.                                                                                                                                                                                                                                                                                                                   |
| `animationDuration`        |                    `number`                     | `none`  | `false`  | The duration the map takes to animate to a new configuration.                                                                                                                                                                                                                                                                                     |
| `animationMode`            | `"flyTo" \| "easeTo" \| "linearTo" \| "moveTo"` | `none`  | `false`  | The easing or path the camera uses to animate to a new configuration.                                                                                                                                                                                                                                                                             |
| `defaultSettings`          |                  `CameraStop`                   | `none`  | `false`  | Default view settings applied on camera                                                                                                                                                                                                                                                                                                           |
| `minZoomLevel`             |                    `number`                     | `none`  | `false`  | Minimum zoom level of the map                                                                                                                                                                                                                                                                                                                     |
| `maxZoomLevel`             |                    `number`                     | `none`  | `false`  | Maximum zoom level of the map                                                                                                                                                                                                                                                                                                                     |
| `maxBounds`                |                 `CameraBounds`                  | `none`  | `false`  | Restrict map panning so that the center is within these bounds                                                                                                                                                                                                                                                                                    |
| `followUserLocation`       |                    `boolean`                    | `none`  | `false`  | Should the map orientation follow the user's.                                                                                                                                                                                                                                                                                                     |
| `followUserMode`           |               `UserTrackingMode`                | `none`  | `false`  | The mode used to track the user location on the map. One of; "normal", "compass", "course". Each mode string is also available as a member on the `UserTrackingMode` object. `Follow` (normal), `FollowWithHeading` (compass), `FollowWithCourse` (course). NOTE: `followUserLocation` must be set to `true` for any of the modes to take effect. |
| `followZoomLevel`          |                    `number`                     | `none`  | `false`  | The zoomLevel on map while followUserLocation is set to `true`                                                                                                                                                                                                                                                                                    |
| `followPitch`              |                    `number`                     | `none`  | `false`  | The pitch on map while followUserLocation is set to `true`                                                                                                                                                                                                                                                                                        |
| `followHeading`            |                    `number`                     | `none`  | `false`  | The heading on map while followUserLocation is set to `true`                                                                                                                                                                                                                                                                                      |
| `onUserTrackingModeChange` |                     `func`                      | `none`  | `false`  | Triggered when `followUserLocation` or `followUserMode` changes<br/>_signature:_`(event:MapLibreRNEvent) => void`                                                                                                                                                                                                                                 |

## Methods

### `fitBounds(ne, sw, [padding], [animationDuration])`

Map camera transitions to fit provided bounds

#### Arguments

| Name                |         Type         | Required | Description                    |
| ------------------- | :------------------: | :------: | ------------------------------ |
| `ne`                |  `GeoJSON.Position`  |  `Yes`   | North east coordinate of bound |
| `sw`                |  `GeoJSON.Position`  |  `Yes`   | South west coordinate of bound |
| `padding`           | `number \| number[]` |   `No`   | Padding for the bounds         |
| `animationDuration` |       `number`       |   `No`   | Duration of camera animation   |

```ts
cameraRef.current?.fitBounds([lng, lat], [lng, lat]);
cameraRef.current?.fitBounds([lng, lat], [lng, lat], 20, 1000); // padding for all sides
cameraRef.current?.fitBounds(
  [lng, lat],
  [lng, lat],
  [verticalPadding, horizontalPadding],
  1000,
);
cameraRef.current?.fitBounds(
  [lng, lat],
  [lng, lat],
  [top, right, bottom, left],
  1000,
);
```

### `flyTo(coordinates, [animationDuration])`

Map camera will fly to new coordinate

#### Arguments

| Name                |        Type        | Required | Description                              |
| ------------------- | :----------------: | :------: | ---------------------------------------- |
| `coordinates`       | `GeoJSON.Position` |  `Yes`   | Coordinates that map camera will jump to |
| `animationDuration` |      `number`      |   `No`   | Duration of camera animation             |

```ts
cameraRef.current?.flyTo([lng, lat]);
cameraRef.current?.flyTo([lng, lat], 12000);
```

### `moveTo(coordinates, [animationDuration])`

Map camera will move to new coordinate at the same zoom level

#### Arguments

| Name                |        Type        | Required | Description                               |
| ------------------- | :----------------: | :------: | ----------------------------------------- |
| `coordinates`       | `GeoJSON.Position` |  `Yes`   | Coordinates that map camera will move too |
| `animationDuration` |      `number`      |   `No`   | Duration of camera animation              |

```ts
cameraRef.current?.moveTo([lng, lat], 200); // eases camera to new location based on duration
cameraRef.current?.moveTo([lng, lat]); // snaps camera to new location without any easing
```

### `zoomTo(zoomLevel, [animationDuration])`

Map camera will zoom to specified level

#### Arguments

| Name                |   Type   | Required | Description                                     |
| ------------------- | :------: | :------: | ----------------------------------------------- |
| `zoomLevel`         | `number` |  `Yes`   | Zoom level that the map camera will animate too |
| `animationDuration` | `number` |   `No`   | Duration of camera animation                    |

```ts
cameraRef.current?.zoomTo(16);
cameraRef.current?.zoomTo(16, 100);
```

### `setCamera([config])`

Map camera will perform updates based on provided config. Advanced use only!

#### Arguments

| Name     |   Type   | Required | Description          |
| -------- | :------: | :------: | -------------------- |
| `config` | `Object` |   `No`   | Camera configuration |

```ts
cameraRef.current?.setCamera({
  centerCoordinate: [lng, lat],
  zoomLevel: 16,
  animationDuration: 2000,
});

cameraRef.current?.setCamera({
  stops: [
    { pitch: 45, animationDuration: 200 },
    { heading: 180, animationDuration: 300 },
  ],
});
```
