---
# DO NOT MODIFY
# This file is auto-generated from src/components/sources/vector-source/VectorSource.tsx
sidebar_label: VectorSource
---

# VectorSource

VectorSource is a map content source that supplies tiled vector data in
Mapbox Vector Tile format to be shown on the map. The location of and
metadata about the tiles are defined either by an option dictionary or by an
external file that conforms to the TileJSON specification.

## Props

### `id`

A string that uniquely identifies the source.

**Type:** `string`

**Required:** No

### `url`

A URL to a TileJSON configuration file describing the source’s contents and
other metadata.

**Type:** `string`

**Required:** No

### `tiles`

An array of tile URL templates. If multiple endpoints are specified, clients
may use any combination of endpoints. Common format should be:
`https://example.com/vector-tiles/{z}/{x}/{y}.pbf` .

**Type:** `string[]`

**Required:** No

### `minzoom`

An unsigned integer that specifies the minimum zoom level at which to display
tiles from the source. The value should be between 0 and 22, inclusive, and
less than maxzoom, if specified. The default value for this option is 0.

**Type:** `number`

**Required:** No

### `maxzoom`

An unsigned integer that specifies the maximum zoom level at which to display
tiles from the source. The value should be between 0 and 22, inclusive, and
less than minzoom, if specified. The default value for this option is 22.

**Type:** `number`

**Required:** No

### `scheme`

Influences the y direction of the tile coordinates. (tms inverts y-axis)

**Type:** `"xyz" | "tms"`

**Required:** No

**Default:** `"xyz"`

### `attribution`

An HTML or literal text string defining the buttons to be displayed in an
action sheet when the source is part of a map view’s style and the map view’s
attribution button is pressed.

**Type:** `string`

**Required:** No

### `children`

**Type:** `ReactNode`

**Required:** No

### `ref`

Ref to access VectorSource methods.

**Type:** `Ref<VectorSourceRef>`

**Required:** No

### `testID`

**Type:** `string`

**Required:** No

### `onPress`

Emits on press when a child `Layer` within the hitbox has highest z-index
This bubbles up to Map's onPress unless `event.stopPropagation()` is called.

**Type:** `(event: NativeSyntheticEvent<PressEventWithFeatures>) => void`

**Required:** No

### `hitbox`

Overrides the default touch hitbox (44 x 44 pixels) for the source layers

**Type:** `ViewPadding`

**Required:** No

## Ref Methods

### `querySourceFeatures(options)`

Returns all features that match the query parameters regardless of whether
the feature is currently rendered on the map. The domain of the query
includes all currently-loaded vector tiles and GeoJSON source tiles. This
function does not check tiles outside the visible viewport.

#### `options`

**Type:**

```ts
{
    sourceLayer: string;
    filter?: FilterSpecification;
  }
```

**Required:** Yes

**Returns:** `Promise<GeoJSON.Feature[]>`

```ts
vectorSource.querySourceFeatures({ sourceLayer: "some-source-layer" });
```

### `setFeatureState(options, state)`

Merges the given `state` object into the runtime state of the feature
identified by `featureId` within the given `sourceLayer` and keeps existing
keys that are not part of the update. The feature must carry an `id` in the
vector tile data. Style expressions read the state through the
`feature-state` operator, which only paint properties support.

#### `options`

**Type:** `{ sourceLayer: string; featureId: string | number }`

**Required:** Yes

#### `state`

Key-value pairs to merge into the feature's state

**Type:** `FeatureState`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await vectorSourceRef.current?.setFeatureState(
  { sourceLayer: "buildings", featureId: feature.id },
  { selected: true },
);
```

### `getFeatureState(options)`

Returns the current runtime state of a feature, or `null` when the feature
has no state.

#### `options`

**Type:**

```ts
{
  sourceLayer: string;
  featureId: string | number;
}
```

**Required:** Yes

**Returns:** `Promise<FeatureState | null>`

```ts
const state = await vectorSourceRef.current?.getFeatureState({
  sourceLayer: "buildings",
  featureId: feature.id,
});
```

### `removeFeatureState(options)`

Removes runtime state within the given `sourceLayer` layer. The scope depends
on the given options:

- `featureId` and `key`: removes one key from one feature
- `featureId` only: removes all state from one feature
- `key` only: removes that key from every feature in the source layer
- neither: removes all state from the source layer
  Removals are applied on the next rendered frame, so `getFeatureState` called
  immediately afterwards may still return the removed entries.

#### `options`

**Type:**

```ts
{
    sourceLayer: string;
    featureId?: string | number;
    key?: string;
  }
```

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await vectorSourceRef.current?.removeFeatureState({
  sourceLayer: "buildings",
  featureId: feature.id,
  key: "selected",
});
```
