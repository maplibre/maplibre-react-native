---
# DO NOT MODIFY
# This file is auto-generated from src/components/Camera.tsx
sidebar_label: Camera
---

# `<Camera />`

## Props

| Prop                        |                                                                                     Type                                                                                     | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialViewState`          | `(CameraOptions & {     longitude?: never;     latitude?: never;     bounds?: never;   }) \| (CameraOptions & CameraCenterOptions) \| (CameraOptions & CameraBoundsOptions)` | `none`  | `false`  | Default view settings applied on camera                                                                                                                                                                                                                                                                                                                       |
| `minZoom`                   |                                                                                   `number`                                                                                   | `none`  | `false`  | Minimum zoom level of the map                                                                                                                                                                                                                                                                                                                                 |
| `maxZoom`                   |                                                                                   `number`                                                                                   | `none`  | `false`  | Maximum zoom level of the map                                                                                                                                                                                                                                                                                                                                 |
| `maxBounds`                 |                                                                                   `Bounds`                                                                                   | `none`  | `false`  | Restrict map panning so that the center is within these bounds                                                                                                                                                                                                                                                                                                |
| `trackUserLocation`         |                                                              `undefined \| "default" \| "heading" \| "course"`                                                               | `none`  | `false`  | The mode used to track the user location on the map:<br/><br/>- undefined: The user's location is not tracked<br/>- "default": Centers the user's location<br/>- "heading": Centers the user's location and uses the compass for bearing<br/>- "course": Centers the user's location and uses the direction of travel for bearing<br/><br/>@default undefined |
| `onTrackUserLocationChange` |                                                                `ComponentProps["onTrackUserLocationChange"]`                                                                 | `none`  | `false`  | Triggered when `trackUserLocation` changes                                                                                                                                                                                                                                                                                                                    |

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

### `easeTo({ center, easing = "ease", duration = 500, ...options })`

#### Arguments

| Name                                                      | Type  | Required | Description |
| --------------------------------------------------------- | :---: | :------: | ----------- |
| `{ center, easing = "ease", duration = 500, ...options }` | `n/a` |  `Yes`   | undefined   |

### `flyTo({ center, easing = "fly", duration = 2000, ...options })`

#### Arguments

| Name                                                      | Type  | Required | Description |
| --------------------------------------------------------- | :---: | :------: | ----------- |
| `{ center, easing = "fly", duration = 2000, ...options }` | `n/a` |  `Yes`   | undefined   |

### `fitBounds(bounds, [{ easing = "fly", duration = 2000, ...options }])`

#### Arguments

| Name                                              | Type  | Required | Description |
| ------------------------------------------------- | :---: | :------: | ----------- |
| `bounds`                                          | `n/a` |  `Yes`   | undefined   |
| `{ easing = "fly", duration = 2000, ...options }` | `n/a` |   `No`   | undefined   |

### `zoomTo(zoom, [{ easing = "ease", duration = 500, ...options }])`

#### Arguments

| Name                                              | Type  | Required | Description |
| ------------------------------------------------- | :---: | :------: | ----------- |
| `zoom`                                            | `n/a` |  `Yes`   | undefined   |
| `{ easing = "ease", duration = 500, ...options }` | `n/a` |   `No`   | undefined   |
