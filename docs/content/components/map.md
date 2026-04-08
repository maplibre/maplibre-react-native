---
# DO NOT MODIFY
# This file is auto-generated from src/components/map/Map.tsx
sidebar_label: Map
sidebar_position: 1
---

# Map

A view of a MapLibre Native Map.

**Rendering a basic Map**

```tsx
<Map mapStyle="https://demotiles.maplibre.org/style.json" />
```

_Also accepts props from: `ViewProps`_

## Props

### `style`

Style for wrapping React Native View

**Type:** `ViewProps["style"]`

**Required:** No

**Default:** `{ flex: 1 }`

### `mapStyle`

Maplibre style - either a URL or a Style JSON.

**Type:** `string | StyleSpecification`

**Required:** Yes

**See also:** [https://maplibre.org/maplibre-style-spec/](https://maplibre.org/maplibre-style-spec/)

### `light`

Light properties of the style. Must conform to the Light Style Specification.
Controls the light source for extruded geometries.

**Type:** `LightSpecification`

**Required:** No

### `contentInset`

The distance from the edges of the map view's frame to the edges of the map
view's logical viewport.

**Type:** `ViewPadding`

**Required:** No

### `preferredFramesPerSecond`

**iOS**: The preferred frame rate at which the map view is rendered. The
default value for this property is MLNMapViewPreferredFramesPerSecondDefault,
which will adaptively set the preferred frame rate based on the capability of
the user’s device to maintain a smooth experience. This property can be set
to arbitrary integer values.
**Android**: The maximum frame rate at which the map view is rendered, but it
can't excess the ability of device hardware. This property can be set to
arbitrary integer values.

**Type:** `number`

**Required:** No

### `dragPan`

Toggle pan interaction of the map

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `touchZoom`

Toggle pinch/scroll zoom interaction of the map.
On Android this also disables `doubleTapZoom` and `doubleTapHoldZoom`.

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `doubleTapZoom`

Toggle double-tap zoom interaction of the map.

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `doubleTapHoldZoom`

Toggle double-tap-and-hold zoom interaction of the map (also known as quick
zoom and one finger zoom).

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `touchRotate`

Toggle rotate interaction of the map

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `touchPitch`

Toggle pitch interaction of the map

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `tintColor`

Tints UI elements like the attribution button

**Type:** `string`

**Required:** No

### `attribution`

Toggle the attribution button of the map

**Type:** `boolean`

**Required:** No

### `attributionPosition`

Positions the attribution button

**Type:** `OrnamentViewPosition`

**Required:** No

### `logo`

Toggle the logo on the map

**Type:** `boolean`

**Required:** No

### `logoPosition`

Positions the logo

**Type:** `OrnamentViewPosition`

**Required:** No

### `compass`

Toggle the compass from appearing on the map

**Type:** `boolean`

**Required:** No

### `compassPosition`

Positions the compass

**Type:** `OrnamentViewPosition`

**Required:** No

### `compassHiddenFacingNorth`

Toggle the compass from hiding when facing north

**Type:** `boolean`

**Required:** No

**Default:** `true`

### `scaleBar`

Toggle the scale bar on the map

**Type:** `boolean`

**Required:** No

### `scaleBarPosition`

Positions the scale bar. Android only supports top-left corner.

**Type:** `OrnamentViewPosition`

**Required:** No

### `androidView`

Android only: Switch between TextureView (default) and GLSurfaceView for
rendering the map

**Type:** `"surface" | "texture"`

**Required:** No

**Default:** `"surface"`

### `onPress`

Called when a user presses the map
If the event bubbles up from a child `Source` with an `onPress` handler the
`features` will be included. The event will emit on `Map` and `Source` . To
prevent this use `event.stopPropagation()` in the `Source` handler.

**Type:** `(
    event:
      | NativeSyntheticEvent<PressEvent>
      | NativeSyntheticEvent<PressEventWithFeatures>,
  ) => void`

**Required:** No

### `onLongPress`

Called when a user long presses the map

**Type:** `(event: NativeSyntheticEvent<PressEvent>) => void`

**Required:** No

### `onRegionWillChange`

Called when the currently displayed map region is about to change

**Type:** `(
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void`

**Required:** No

### `onRegionIsChanging`

Called when the currently displayed map region is changing

**Type:** `(
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void`

**Required:** No

### `onRegionDidChange`

Called when the currently displayed map region finished changing

**Type:** `(
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void`

**Required:** No

### `onWillStartLoadingMap`

Called when the map is about to start loading a new map style

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishLoadingMap`

Called when the map has successfully loaded a new map style

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFailLoadingMap`

Called when the map has failed to load a new map style

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onWillStartRenderingFrame`

Called when the map will start rendering a frame

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishRenderingFrame`

Called when the map finished rendering a frame

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishRenderingFrameFully`

Called when the map fully finished rendering a frame

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onWillStartRenderingMap`

Called when the map will start rendering itself

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishRenderingMap`

Called when the map has finished rendering itself

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishRenderingMapFully`

Called when the map has fully finished rendering itself

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `onDidFinishLoadingStyle`

Triggered when a style has finished loading

**Type:** `(event: NativeSyntheticEvent<null>) => void`

**Required:** No

### `ref`

Ref to access Map methods.

**Type:** `Ref<MapRef>`

**Required:** No

## Ref Methods

### `getCenter()`

Returns the current center coordinates of the map

**Returns:** `Promise<LngLat>` — Current center coordinates of the map

```ts
await mapRef.current?.getCenter();
```

### `getZoom()`

Returns the current zoom level of the map

**Returns:** `Promise<number>` — Current zoom level of the map

```ts
await mapRef.current?.getZoom();
```

### `getBearing()`

Returns the current bearing of the map

**Returns:** `Promise<number>` — Current bearing of the map

```ts
await mapRef.current?.getBearing();
```

### `getPitch()`

Returns the current pitch of the map

**Returns:** `Promise<number>` — Current pitch of the map

```ts
await mapRef.current?.getPitch();
```

### `getBounds()`

Returns the current bounds of the map

**Returns:** `Promise<LngLatBounds>` — Current bounds of the map

```ts
await mapRef.current?.getBounds();
```

### `getViewState()`

Returns the current view state of the map

**Returns:** `Promise<ViewState>` — Current view state of the map

```ts
await mapRef.current?.getViewState();
```

### `project(lngLat)`

Converts geographic coordinates to pixel point of the view

#### `lngLat`

Geographic coordinate

**Type:** `LngLat`

**Required:** Yes

**Returns:** `Promise<PixelPoint>` — Pixel point

```ts
await mapRef.current?.project([13.04214014753952, 47.80554907882145]);
```

### `unproject(point)`

Converts a pixel point of the view to geographic coordinates.

#### `point`

Pixel point

**Type:** `PixelPoint`

**Required:** Yes

**Returns:** `Promise<LngLat>` — Geographic coordinate

```ts
await mapRef.current?.unproject([280, 640]);
```

### `queryRenderedFeatures(pixelPoint, [options])`

Query rendered features at a point

#### `pixelPoint`

**Type:** `PixelPoint`

**Required:** Yes

#### `options`

**Type:** `QueryRenderedFeaturesOptions`

**Required:** No

**Returns:** `Promise<GeoJSON.Feature[]>` — Queried features

```ts
await mapRef.current?.queryRenderedFeatures([240, 640], {
  filter: ["==", "type", "Point"],
  layers: ["restaurants", "shops"],
});
```

### `queryRenderedFeatures(pixelPointBounds, [options])`

Query rendered features within pixel bounds

#### `pixelPointBounds`

**Type:** `PixelPointBounds`

**Required:** Yes

#### `options`

**Type:** `QueryRenderedFeaturesOptions`

**Required:** No

**Returns:** `Promise<GeoJSON.Feature[]>` — Queried features

```ts
await mapRef.current?.queryRenderedFeatures([100, 100, 400, 400], {
  filter: ["==", "type", "Point"],
  layers: ["restaurants", "shops"],
});
```

### `queryRenderedFeatures([options])`

Query rendered features within the current viewport

#### `options`

**Type:** `QueryRenderedFeaturesOptions`

**Required:** No

**Returns:** `Promise<GeoJSON.Feature[]>` — Queried features

```ts
await mapRef.current?.queryRenderedFeatures({
  filter: ["==", "type", "Point"],
  layers: ["restaurants", "shops"],
});
```

### `createStaticMapImage(options)`

Takes static-map image of the currently displayed map

#### `options`

**Type:** `{ output: "base64" | "file" }`

**Required:** Yes

**Returns:** `Promise<string>` — Base64 encoded image or URI of image file

### `setSourceVisibility(visible, source, [sourceLayer])`

Sets the visibility of all the layers referencing the specified `source` and
optionally `sourceLayer`

#### `visible`

Visibility of the layers

**Type:** `boolean`

**Required:** Yes

#### `source`

Identifier of the target source (e.g. 'composite')

**Type:** `string`

**Required:** Yes

#### `sourceLayer`

Identifier of the target source-layer (e.g. 'building')

**Type:** `string`

**Required:** No

**Returns:** `Promise<void>`

```ts
await mapRef.current?.setSourceVisibility(false, "composite", "building");
```

### `showAttribution()`

Show the attribution dialog
Can be used to implement a custom attribution button.

**Returns:** `Promise<void>`

## Types

### `OrnamentViewPosition`

Screen position for map ornaments (logo, compass, scale bar). Exactly one of
`top` / `bottom` and one of `left` / `right` must be provided.

```ts
type OrnamentViewPosition =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };
```

### `ViewState`

Current viewport state of the map.

```ts
type ViewState = {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  bounds: LngLatBounds;
};
```

### `ViewStateChangeEvent`

Event emitted when the map viewport changes (pan, zoom, rotate, pitch).

```ts
type ViewStateChangeEvent = ViewState & {
  animated: boolean;
  userInteraction: boolean;
};
```

### `QueryRenderedFeaturesOptions`

Options for querying rendered features at a screen point or within a bounding
box.

```ts
type QueryRenderedFeaturesOptions = {
  /**
   * Filter expression to filter the queried features
   */
  filter?: FilterSpecification;

  /**
   * IDs of layers to query features from
   */
  layers?: string[];
};
```
