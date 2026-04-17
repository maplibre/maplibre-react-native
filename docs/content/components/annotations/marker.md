---
# DO NOT MODIFY
# This file is auto-generated from src/components/annotations/marker/Marker.tsx
sidebar_label: Marker
---

# Marker

Marker allows you to place an interactive React Native View on the map.
If you have static view consider using ViewAnnotation or SymbolLayer for
better performance.
Implemented through:

- Android: Native Views placed on the map projection
- iOS:
  [MLNPointAnnotation](https://maplibre.org/maplibre-native/ios/latest/documentation/maplibre/mlnpointannotation/)

_Also accepts props from: `ViewProps`_

## Props

### `id`

A string that uniquely identifies the marker.

**Type:** `string`

**Required:** No

### `lngLat`

The center point (specified as a map coordinate) of the marker. See also
#anchor.

**Type:** `LngLat`

**Required:** Yes

### `anchor`

Specifies the anchor being set on a particular point of the annotation. The
anchor indicates which part of the marker should be placed closest to the
coordinate.

**Type:** `Anchor`

**Required:** No

**Default:** `"center"`

**See also:** [https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/)

### `offset`

The offset in pixels to apply relative to the anchor. Negative values
indicate left and up.

**Type:** `PixelPoint`

**Required:** No

**Default:** `[0, 0]`

**See also:** [https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset)

### `selected`

Manually selects/deselects the marker.
iOS

**Type:** `boolean`

**Required:** No

### `onPress`

This callback is fired when the marker is pressed.

**Type:** `(event: NativeSyntheticEvent<MarkerEvent>) => void`

**Required:** No

### `children`

Expects one child - can be a View with multiple elements.

**Type:** `ReactElement`

**Required:** Yes

### `ref`

Ref to access Marker methods.

**Type:** `Ref<MarkerRef>`

**Required:** No

## Ref Methods

### `getAnimatableRef()`

Returns the native ref for Reanimated v4 compatibility.

**Returns:** `NativeMarkerRef | null`

## Types

### `MarkerEvent`

Event emitted by a Marker on press.

```ts
type MarkerEvent = PressEvent & {
  id: string;
};
```
