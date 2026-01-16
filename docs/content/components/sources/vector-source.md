---
# DO NOT MODIFY
# This file is auto-generated from src/components/VectorSource.tsx
sidebar_label: VectorSource
---

# `<VectorSource />`

VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.<br/>The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.

## Props

| Prop          |       Type       | Default | Required | Description                                                                                                                                                                                                                                      |
| ------------- | :--------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`          |     `string`     | `none`  | `false`  | A string that uniquely identifies the source.                                                                                                                                                                                                    |
| `url`         |     `string`     | `none`  | `false`  | A URL to a TileJSON configuration file describing the source’s contents and other metadata.                                                                                                                                                      |
| `tiles`       |     `Array`      | `none`  | `false`  | An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.<br/>Example: https://example.com/vector-tiles/{z}/{x}/{y}.pbf                                                                 |
| `minzoom`     |     `number`     | `none`  | `false`  | An unsigned integer that specifies the minimum zoom level at which to display tiles from the source.<br/>The value should be between 0 and 22, inclusive, and less than<br/>maxZoomLevel, if specified. The default value for this option is 0.  |
| `maxzoom`     |     `number`     | `none`  | `false`  | An unsigned integer that specifies the maximum zoom level at which to display tiles from the source.<br/>The value should be between 0 and 22, inclusive, and less than<br/>minZoomLevel, if specified. The default value for this option is 22. |
| `scheme`      | `"xyz" \| "tms"` | `none`  | `false`  | Influences the y direction of the tile coordinates. (tms inverts y-axis)<br/><br/>@default "xyz"                                                                                                                                                 |
| `attribution` |     `string`     | `none`  | `false`  | An HTML or literal text string defining the buttons to be displayed in an action sheet when the<br/>source is part of a map view’s style and the map view’s attribution button is pressed.                                                       |
| `children`    |   `ReactNode`    | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                            |

## Methods

### `querySourceFeatures({<br/>  sourceLayer,<br/>  filter,<br/>}: {<br/>  sourceLayer: string;<br/>  filter?: FilterExpression;<br/>})`

#### Arguments

| Name                                                                                                            |                       Type                       | Required | Description |
| --------------------------------------------------------------------------------------------------------------- | :----------------------------------------------: | :------: | ----------- |
| `{<br/>  sourceLayer,<br/>  filter,<br/>}: {<br/>  sourceLayer: string;<br/>  filter?: FilterExpression;<br/>}` | `{sourceLayer:string;filter?:FilterExpression;}` |  `Yes`   | undefined   |
