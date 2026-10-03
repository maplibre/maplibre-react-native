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

### `setFeatureState(feature, state)`

Sets the `state` of a feature. A feature's `state` is a set of user-defined
key-value pairs that are assigned to a feature at runtime. The given `state`
object is merged with any existing key-value pairs in the feature's state.
Features are identified by their `id` within a `sourceLayer` , which can be
any number or string. The feature must carry an `id` in the vector tile data.
Use the `feature-state` expression to access the values in a feature's state
object for the purposes of styling. Only paint properties support it.

#### `feature`

Feature identifier

**Type:** `{ id: string | number; sourceLayer: string }`

**Required:** Yes

#### `state`

A set of key-value pairs. The values should be valid JSON types.

**Type:** `FeatureState`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await vectorSourceRef.current?.setFeatureState(
  { id: feature.id, sourceLayer: "buildings" },
  { selected: true },
);
```

### `getFeatureState(feature)`

Gets the `state` of a feature. Resolves to `null` when the feature has no
state.

#### `feature`

Feature identifier

**Type:**

```ts
{
  id: string | number;
  sourceLayer: string;
}
```

**Required:** Yes

**Returns:** `Promise<FeatureState | null>`

```ts
const state = await vectorSourceRef.current?.getFeatureState({
  id: feature.id,
  sourceLayer: "buildings",
});
```

### `removeFeatureState(feature, [key])`

Removes the `state` of a feature, setting it back to the default behavior. If
only `feature.id` is specified, it removes all keys of that feature's state.
If `key` is also specified, it removes only that key of that feature's state.
A `key` can only be removed for a specific feature; there is no way to remove
one key from every feature at once.
Removals are applied on the next rendered frame, so `getFeatureState` called
immediately afterwards may still return the removed entries.

#### `feature`

Feature identifier

**Type:** `{ id: string | number; sourceLayer: string }`

**Required:** Yes

#### `key`

The key in the feature state to reset

**Type:** `string`

**Required:** No

**Returns:** `Promise<void>`

```ts
// Reset the entire state of one feature
await vectorSourceRef.current?.removeFeatureState({
  id: feature.id,
  sourceLayer: "buildings",
});
// Reset only the `selected` key of one feature
await vectorSourceRef.current?.removeFeatureState(
  { id: feature.id, sourceLayer: "buildings" },
  "selected",
);
```

### `removeFeatureState(feature)`

Removes the `state` of all features in the given source layer, setting them
back to the default behavior.
Removals are applied on the next rendered frame, so `getFeatureState` called
immediately afterwards may still return the removed entries.

#### `feature`

Source layer identifier

**Type:** `{ sourceLayer: string }`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await vectorSourceRef.current?.removeFeatureState({
  sourceLayer: "buildings",
});
```
