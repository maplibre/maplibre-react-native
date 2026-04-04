---
# DO NOT MODIFY
# This file is auto-generated from src/components/VectorSource.tsx
sidebar_label: VectorSource
---

# `<VectorSource />`

VectorSource is a map content source that supplies tiled vector data in<br/>Mapbox Vector Tile format to be shown on the map. The location of and<br/>metadata about the tiles are defined either by an option dictionary or by an<br/>external file that conforms to the TileJSON specification.

## Props

| Prop          |       Type       | Default | Required | Description                                                                                                                                                                                                                                 |
| ------------- | :--------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          |     `string`     | `none`  | `false`  | A string that uniquely identifies the source.                                                                                                                                                                                               |
| `url`         |     `string`     | `none`  | `false`  | A URL to a TileJSON configuration file describing the source’s contents and<br/>other metadata.                                                                                                                                             |
| `tiles`       |     `Array`      | `none`  | `false`  | An array of tile URL templates. If multiple endpoints are specified, clients<br/>may use any combination of endpoints. Example:<br/>https://example.com/vector-tiles/{z}/{x}/{y}.pbf                                                        |
| `minzoom`     |     `number`     | `none`  | `false`  | An unsigned integer that specifies the minimum zoom level at which to display<br/>tiles from the source. The value should be between 0 and 22, inclusive, and<br/>less than maxzoom, if specified. The default value for this option is 0.  |
| `maxzoom`     |     `number`     | `none`  | `false`  | An unsigned integer that specifies the maximum zoom level at which to display<br/>tiles from the source. The value should be between 0 and 22, inclusive, and<br/>less than minzoom, if specified. The default value for this option is 22. |
| `scheme`      | `"xyz" \| "tms"` | `none`  | `false`  | Influences the y direction of the tile coordinates. (tms inverts y-axis)<br/><br/>@defaultValue "xyz"                                                                                                                                       |
| `attribution` |     `string`     | `none`  | `false`  | An HTML or literal text string defining the buttons to be displayed in an<br/>action sheet when the source is part of a map view’s style and the map view’s<br/>attribution button is pressed.                                              |
| `children`    |   `ReactNode`    | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                       |
| `ref`         |      `Ref`       | `none`  | `false`  | Ref to access VectorSource methods.                                                                                                                                                                                                         |

## Methods

### `querySourceFeatures({<br/>  sourceLayer,<br/>  filter,<br/>}: {<br/>  sourceLayer: string;<br/>  filter?: FilterSpecification;<br/>})`

#### Arguments

| Name                                                                                                               |                        Type                         | Required | Description |
| ------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------: | :------: | ----------- |
| `{<br/>  sourceLayer,<br/>  filter,<br/>}: {<br/>  sourceLayer: string;<br/>  filter?: FilterSpecification;<br/>}` | `{sourceLayer:string;filter?:FilterSpecification;}` |  `Yes`   | undefined   |
