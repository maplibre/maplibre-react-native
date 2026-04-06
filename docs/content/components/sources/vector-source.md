---
# DO NOT MODIFY
# This file is auto-generated from src/components/sources/vector-source/VectorSource.tsx
sidebar_label: VectorSource
---

# `<VectorSource />`

VectorSource is a map content source that supplies tiled vector data in
Mapbox Vector Tile format to be shown on the map. The location of and
metadata about the tiles are defined either by an option dictionary or by an
external file that conforms to the TileJSON specification.

_Also accepts props from: `BaseProps`, `PressableSourceProps`_

## Props

### `id`

A string that uniquely identifies the source.

**Type:** `string` | **Required:** No

### `url`

A URL to a TileJSON configuration file describing the source’s contents and
other metadata.

**Type:** `string` | **Required:** No

### `tiles`

An array of tile URL templates. If multiple endpoints are specified, clients
may use any combination of endpoints. Example:
https://example.com/vector-tiles/z/x/y.pbf

**Type:** `string[]` | **Required:** No

### `minzoom`

An unsigned integer that specifies the minimum zoom level at which to display
tiles from the source. The value should be between 0 and 22, inclusive, and
less than maxzoom, if specified. The default value for this option is 0.

**Type:** `number` | **Required:** No

### `maxzoom`

An unsigned integer that specifies the maximum zoom level at which to display
tiles from the source. The value should be between 0 and 22, inclusive, and
less than minzoom, if specified. The default value for this option is 22.

**Type:** `number` | **Required:** No

### `scheme`

Influences the y direction of the tile coordinates. (tms inverts y-axis)

**Type:** `"xyz" \| "tms"` | **Required:** No | **Default:** `"xyz"`

### `attribution`

An HTML or literal text string defining the buttons to be displayed in an
action sheet when the source is part of a map view’s style and the map view’s
attribution button is pressed.

**Type:** `string` | **Required:** No

### `children`

**Type:** `ReactNode` | **Required:** No

### `ref`

Ref to access VectorSource methods.

**Type:** `Ref<VectorSourceRef>` | **Required:** No

## Ref Methods

### `querySourceFeatures(options)`

Returns all features that match the query parameters regardless of whether or
not the feature is currently rendered on the map. The domain of the query
includes all currently-loaded vector tiles and GeoJSON source tiles. This
function does not check tiles outside of the visible viewport.

#### Arguments

| Name      | Type                                                               | Required | Description |
| :-------- | :----------------------------------------------------------------- | :------- | :---------- |
| `options` | `{     sourceLayer: string;     filter?: FilterSpecification;   }` | Yes      |             |

**Returns:** `Promise<GeoJSON.Feature[]>`

**vectorSource.features(['id1', 'id2'])**
