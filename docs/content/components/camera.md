---
# DO NOT MODIFY
# This file is auto-generated from src/components/camera/Camera.tsx
sidebar_label: Camera
sidebar_position: 2
---

# Camera

Controls the viewport of the Map.

_Also accepts props from: `BaseProps`, `Partial`_

## Props

### `initialViewState`

Default view settings applied on camera

**Type:** `InitialViewState`

**Required:** No

### `minZoom`

Minimum zoom level of the map

**Type:** `number`

**Required:** No

### `maxZoom`

Maximum zoom level of the map

**Type:** `number`

**Required:** No

### `maxBounds`

Restrict map panning so that the center is within these bounds

**Type:** `LngLatBounds`

**Required:** No

### `trackUserLocation`

The mode used to track the user location on the map:

- `undefined`: The user's location is not tracked
- `"default"`: Centers the user's location
- `"heading"`: Centers the user's location and uses the compass for bearing
- `"course"`: Centers the user's location and uses the direction of travel for
  bearing

**Type:** `TrackUserLocation`

**Required:** No

**Default:** `undefined`

### `onTrackUserLocationChange`

Triggered when `trackUserLocation` changes

**Type:** `(
      event: NativeSyntheticEvent<TrackUserLocationChangeEvent>,
    ) => void`

**Required:** No

### `ref`

Ref to access Camera methods.

**Type:** `Ref<CameraRef>`

**Required:** No

## Ref Methods

### `jumpTo(options)`

Map camera will move to new coordinates at the same zoom level

#### `options`

**Type:** `CameraCenterOptions & CameraOptions`

**Required:** Yes

**Jump to a position**

```ts
cameraRef.current?.jumpTo({ center: [lng, lat] });
```

### `easeTo(options)`

Map camera will move to new coordinates at the same zoom level

#### `options`

**Type:** `CameraCenterOptions & CameraOptions & CameraAnimationOptions`

**Required:** Yes

**Eases camera to new location based on duration**

```ts
cameraRef.current?.easeTo({ center: [lng, lat], duration: 200 });
```

### `flyTo(options)`

Map camera will fly to new coordinate

#### `options`

**Type:** `CameraCenterOptions & CameraOptions & CameraAnimationOptions`

**Required:** Yes

**cameraRef.current?.flyTo(center: [lng, lat], duration: 12000)**

### `fitBounds(bounds, [options])`

Map camera transitions to fit provided bounds

#### `bounds`

**Type:** `LngLatBounds`

**Required:** Yes

#### `options`

**Type:** `CameraOptions & CameraAnimationOptions`

**Required:** No

```ts
cameraRef.current?.fitBounds(
  [west, south, east, north],
  { top: 20, right: 20, bottom: 20, left: 20 },
  1000,
);
```

### `zoomTo(zoom, [options])`

Map camera will zoom to specified level

#### `zoom`

Zoom level that the map camera will animate too

**Type:** `number`

**Required:** Yes

#### `options`

Options

**Type:** `CameraOptions & CameraAnimationOptions`

**Required:** No

```ts
cameraRef.current?.zoomTo(16, { duration: 100 });
```

### `setStop(stop)`

Map camera will perform updates based on provided config. Advanced use only!

#### `stop`

Array of Camera stops

**Type:** `CameraStop`

**Required:** Yes

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

## Types

### `CameraOptions`

Camera viewport configuration: zoom, bearing, pitch, and padding.

```ts
interface CameraOptions {
  zoom?: number;
  bearing?: number;
  pitch?: number;
  padding?: ViewPadding;
}
```

### `CameraEasing`

Easing function used for camera animations.

```ts
type CameraEasing = undefined | "linear" | "ease" | "fly";
```

### `CameraAnimationOptions`

Animation timing options for camera transitions.

```ts
interface CameraAnimationOptions {
  duration?: number;
  easing?: CameraEasing;
}
```

### `CameraCenterOptions`

Camera center coordinate options.

```ts
interface CameraCenterOptions {
  center: LngLat;
}
```

### `CameraBoundsOptions`

Camera bounds options.

```ts
interface CameraBoundsOptions {
  bounds: LngLatBounds;
}
```

### `CameraCenterStop`

Camera animation stop positioned by a center coordinate.

```ts
type CameraCenterStop = CameraOptions &
  CameraAnimationOptions &
  CameraCenterOptions;
```

### `CameraBoundsStop`

Camera animation stop positioned by geographic bounds.

```ts
type CameraBoundsStop = CameraOptions &
  CameraAnimationOptions &
  CameraBoundsOptions;
```

### `CameraStop`

A single camera animation stop — optionally positioned by center, bounds, or
neither.

```ts
type CameraStop =
  | (CameraOptions &
      CameraAnimationOptions & {
        center?: never;
        bounds?: never;
      })
  | CameraCenterStop
  | CameraBoundsStop;
```

### `InitialViewState`

Initial camera state when the map first loads.

```ts
type InitialViewState =
  | (CameraOptions & {
      center?: never;
      bounds?: never;
    })
  | (CameraOptions & CameraCenterOptions)
  | (CameraOptions & CameraBoundsOptions);
```

### `TrackUserLocation`

User location tracking mode.

```ts
type TrackUserLocation = "default" | "heading" | "course";
```

### `TrackUserLocationChangeEvent`

Event emitted when the user location tracking mode changes.

```ts
type TrackUserLocationChangeEvent = {
  trackUserLocation: TrackUserLocation | null;
};
```
