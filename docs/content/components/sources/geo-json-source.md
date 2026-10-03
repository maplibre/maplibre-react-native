---
# DO NOT MODIFY
# This file is auto-generated from src/components/sources/geojson-source/GeoJSONSource.tsx
sidebar_label: GeoJSONSource
---

# GeoJSONSource

GeoJSONSource is a map content source that supplies GeoJSON to be shown on
the map. The data may be provided as an url or a GeoJSON object.

## Props

### `id`

A string that uniquely identifies the source.

**Type:** `string`

**Required:** No

### `data`

Can be provided as one of:

- An HTTP(S) URL, absolute file URL, or local file URL relative to the current
  application’s resource bundle
- Any valid GeoJSON object

**Type:** `string | GeoJSON.GeoJSON`

**Required:** Yes

### `cluster`

Enables clustering on the source

**Type:** `boolean`

**Required:** No

### `clusterRadius`

Specifies the radius of each cluster if clustering is enabled. A value of 512
produces a radius equal to the width of a tile. The default value is 50.

**Type:** `number`

**Required:** No

### `clusterMinPoints`

Specifies minimum number of points to form a cluster if clustering is
enabled. The default value is 2.

**Type:** `number`

**Required:** No

### `clusterMaxZoom`

Specifies the maximum zoom level at which to cluster points if clustering is
enabled. Defaults to one zoom level less than the value of maxzoom so that,
at the maximum zoom, the data is not clustered.

**Type:** `number`

**Required:** No

### `clusterProperties`

Specifies custom properties on the generated clusters if clustering is
enabled, aggregating values from clustered points.
Has the form `{ "property_name": [operator, map_expression]}` , where
`operator` is a custom reduce expression that references a special
`["accumulated"]` value - it accumulates the property value from
clusters/points the cluster contains `map_expression` produces the value of a
single point

**Type:** `GeoJSONSourceSpecification["clusterProperties"]`

**Required:** No

### `maxzoom`

Specifies the maximum zoom level at which to create vector tiles. A greater
value produces greater detail at high zoom levels. The default value is 18.

**Type:** `number`

**Required:** No

### `buffer`

Specifies the size of the tile buffer on each side. A value of 0 produces no
buffer. A value of 512 produces a buffer as wide as the tile itself. Larger
values produce fewer rendering artifacts near tile edges and slower
performance. The default value is 128.

**Type:** `number`

**Required:** No

### `tolerance`

Douglas-Peucker simplification tolerance applied to geometries
Higher means simpler geometries and faster performance.

**Type:** `number`

**Required:** No

**Default:** `0.375`

### `lineMetrics`

Whether to calculate line distance metrics. This is required for line layers
that specify lineGradient values. The default value is false.

**Type:** `boolean`

**Required:** No

### `children`

**Type:** `ReactNode`

**Required:** No

### `ref`

Ref to access GeoJSONSource methods.

**Type:** `Ref<GeoJSONSourceRef>`

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

### `getData([filter])`

Get all features from the source that match the filter, regardless of
visibility

#### `filter`

Optional filter statement to filter the returned features

**Type:** `FilterSpecification`

**Required:** No

**Returns:** `Promise<GeoJSON.FeatureCollection>`

**const data = await geoJSONSourceRef.current?.getData(clusterId);**

### `getClusterExpansionZoom(clusterId)`

Returns the zoom needed to expand the cluster.

#### `clusterId`

The feature cluster to expand.

**Type:** `number`

**Required:** Yes

**Returns:** `Promise<number>` — Zoom level at which the cluster expands

**const zoom = await geoJSONSourceRef.current?.getClusterExpansionZoom(clusterId);**

### `getClusterLeaves(clusterId, limit, offset)`

Returns the FeatureCollection from the cluster.

#### `clusterId`

The feature cluster to expand.

**Type:** `number`

**Required:** Yes

#### `limit`

The number of points to return.

**Type:** `number`

**Required:** Yes

#### `offset`

The amount of points to skip (for pagination).

**Type:** `number`

**Required:** Yes

**Returns:** `Promise<GeoJSON.Feature[]>`

**const collection = await geoJSONSourceRef.current?.getClusterLeaves(clusterId, limit, offset);**

### `getClusterChildren(clusterId)`

Returns the FeatureCollection from the cluster (on the next zoom level).

#### `clusterId`

The feature cluster to expand.

**Type:** `number`

**Required:** Yes

**Returns:** `Promise<GeoJSON.Feature[]>`

**const collection = await geoJSONSourceRef.current?.getClusterChildren(clusterId);**

### `setFeatureState(feature, state)`

Sets the `state` of a feature. A feature's `state` is a set of user-defined
key-value pairs that are assigned to a feature at runtime. The given `state`
object is merged with any existing key-value pairs in the feature's state.
Features are identified by their `id` , which can be any number or string.
The feature must carry an `id` in the source data.
Use the `feature-state` expression to access the values in a feature's state
object for the purposes of styling. Only paint properties support it.

#### `feature`

Feature identifier

**Type:** `{ id: string | number }`

**Required:** Yes

#### `state`

A set of key-value pairs. The values should be valid JSON types.

**Type:** `FeatureState`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await geoJSONSourceRef.current?.setFeatureState(
  { id: feature.id },
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
}
```

**Required:** Yes

**Returns:** `Promise<FeatureState | null>`

```ts
const state = await geoJSONSourceRef.current?.getFeatureState({
  id: feature.id,
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

**Type:** `{ id: string | number }`

**Required:** Yes

#### `key`

The key in the feature state to reset

**Type:** `string`

**Required:** No

**Returns:** `Promise<void>`

```ts
// Reset the entire state of one feature
await geoJSONSourceRef.current?.removeFeatureState({ id: feature.id });
// Reset only the `selected` key of one feature
await geoJSONSourceRef.current?.removeFeatureState(
  { id: feature.id },
  "selected",
);
```

### `removeFeatureState()`

Removes the `state` of all features in the source, setting them back to the
default behavior.
Removals are applied on the next rendered frame, so `getFeatureState` called
immediately afterwards may still return the removed entries.

**Returns:** `Promise<void>`

```ts
await geoJSONSourceRef.current?.removeFeatureState();
```

### `getAnimatableRef()`

Returns the native ref for Reanimated compatibility.

**Returns:** `NativeGeoJSONSourceRef | null`
