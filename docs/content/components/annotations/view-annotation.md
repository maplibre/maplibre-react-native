---
# DO NOT MODIFY
# This file is auto-generated from src/components/annotations/view-annotation/ViewAnnotation.tsx
sidebar_label: ViewAnnotation
---

# ViewAnnotation

ViewAnnotation represents a one-dimensional shape located at a single
geographical coordinate.
Consider using GeoJSONSource and SymbolLayer instead, if you have many
points, and you have static images, they'll offer much better performance.
If you need interactive views please use Marker, as with ViewAnnotation on
Android child views are rendered onto a bitmap for better performance.

## Props

### `id`

A string that uniquely identifies the annotation. If not provided, a unique
ID will be generated automatically.

**Type:** `string`

**Required:** No

### `title`

The string containing the annotation's title. Note this is required to be set
if you want to see a callout appear on iOS.

**Type:** `string`

**Required:** No

### `snippet`

The string containing the annotation's snippet(subtitle). Not displayed in
the default callout.

**Type:** `string`

**Required:** No

### `selected`

Manually selects/deselects annotation

**Type:** `boolean`

**Required:** No

### `draggable`

Enable or disable dragging.

**Type:** `boolean`

**Required:** No

**Default:** `false`

### `lngLat`

The center point (specified as a map coordinate) of the annotation.

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

### `onPress`

This callback is fired when the annotation is pressed.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `onSelect`

This callback is fired once this annotation is selected.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `onDeselect`

This callback is fired once this annotation is deselected.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `onDragStart`

This callback is fired once this annotation has started being dragged.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `onDragEnd`

This callback is fired once this annotation has stopped being dragged.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `onDrag`

This callback is fired while this annotation is being dragged.

**Type:** `(event: NativeSyntheticEvent<ViewAnnotationEvent>) => void`

**Required:** No

### `style`

**Type:** `ViewProps["style"]`

**Required:** No

### `children`

Expects one child, and an optional callout can be added as well

**Type:** `ReactElement | [ReactElement, ReactElement]`

**Required:** Yes

### `ref`

Ref to access ViewAnnotation methods.

**Type:** `Ref<ViewAnnotationRef>`

**Required:** No

## Ref Methods

### `refresh()`

On android point annotation is rendered offscreen with a canvas into an
image. To rerender the image from the current state of the view call refresh.
Call this for example from Image#onLoad.

### `getAnimatableRef()`

Returns the native ref for Reanimated v4 compatibility. Uses a Proxy to map
\_viewConfig to \_\_viewConfig.

**Returns:** `NativeViewAnnotationRef | null`
