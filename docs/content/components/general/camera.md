---
# DO NOT MODIFY
# This file is auto-generated from src/components/Camera.tsx
sidebar_label: Camera
---

# `<Camera />`

## Props

| Prop                        |                                                                        Type                                                                         | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialViewState`          | `(CameraOptions & {     center?: never;     bounds?: never;   }) \| (CameraOptions & CameraCenterOptions) \| (CameraOptions & CameraBoundsOptions)` | `none`  | `false`  | Default view settings applied on camera                                                                                                                                                                                                                                                                                                                       |
| `minZoom`                   |                                                                      `number`                                                                       | `none`  | `false`  | Minimum zoom level of the map                                                                                                                                                                                                                                                                                                                                 |
| `maxZoom`                   |                                                                      `number`                                                                       | `none`  | `false`  | Maximum zoom level of the map                                                                                                                                                                                                                                                                                                                                 |
| `maxBounds`                 |                                                                   `LngLatBounds`                                                                    | `none`  | `false`  | Restrict map panning so that the center is within these bounds                                                                                                                                                                                                                                                                                                |
| `trackUserLocation`         |                                                        `"default" \| "heading" \| "course"`                                                         | `none`  | `false`  | The mode used to track the user location on the map:<br/><br/>- undefined: The user's location is not tracked<br/>- "default": Centers the user's location<br/>- "heading": Centers the user's location and uses the compass for bearing<br/>- "course": Centers the user's location and uses the direction of travel for bearing<br/><br/>@default undefined |
| `onTrackUserLocationChange` |                                                                       `func`                                                                        | `none`  | `false`  | Triggered when `trackUserLocation` changes<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                             |

## Methods

### `setStop(stop)`

#### Arguments

| Name   | Type  | Required | Description |
| ------ | :---: | :------: | ----------- |
| `stop` | `n/a` |  `Yes`   | undefined   |

### `jumpTo({ center, ...options })`

#### Arguments

| Name                     | Type  | Required | Description |
| ------------------------ | :---: | :------: | ----------- |
| `{ center, ...options }` | `n/a` |  `Yes`   | undefined   |

### `easeTo({ center, duration = 500, easing = "ease", ...options })`

#### Arguments

| Name                                                      | Type  | Required | Description |
| --------------------------------------------------------- | :---: | :------: | ----------- |
| `{ center, duration = 500, easing = "ease", ...options }` | `n/a` |  `Yes`   | undefined   |

### `flyTo({ center, duration = 2000, easing = "fly", ...options })`

#### Arguments

| Name                                                      | Type  | Required | Description |
| --------------------------------------------------------- | :---: | :------: | ----------- |
| `{ center, duration = 2000, easing = "fly", ...options }` | `n/a` |  `Yes`   | undefined   |

### `fitBounds(bounds, [{ duration = 2000, easing = "fly", ...options }])`

#### Arguments

| Name                                              | Type  | Required | Description |
| ------------------------------------------------- | :---: | :------: | ----------- |
| `bounds`                                          | `n/a` |  `Yes`   | undefined   |
| `{ duration = 2000, easing = "fly", ...options }` | `n/a` |   `No`   | undefined   |

### `zoomTo(zoom, [{ duration = 500, easing = "ease", ...options }])`

#### Arguments

| Name                                              | Type  | Required | Description |
| ------------------------------------------------- | :---: | :------: | ----------- |
| `zoom`                                            | `n/a` |  `Yes`   | undefined   |
| `{ duration = 500, easing = "ease", ...options }` | `n/a` |   `No`   | undefined   |
