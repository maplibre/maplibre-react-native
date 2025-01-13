---
# DO NOT MODIFY
# This file is auto-generated from src/components/VectorSource.tsx
sidebar_label: VectorSource
---

# `<VectorSource />`

VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.<br/>The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.

## Props

| Prop               |    Type     |                 Default                  | Required | Description                                                                                                                                                                                                                                      |
| ------------------ | :---------: | :--------------------------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`               |  `string`   | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | A string that uniquely identifies the source.                                                                                                                                                                                                    |
| `url`              |  `string`   |                  `none`                  | `false`  | A URL to a TileJSON configuration file describing the source’s contents and other metadata.                                                                                                                                                      |
| `tileUrlTemplates` |   `Array`   |                  `none`                  | `false`  | An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.<br/>Example: https://example.com/vector-tiles/{z}/{x}/{y}.pbf                                                                 |
| `minZoomLevel`     |  `number`   |                  `none`                  | `false`  | An unsigned integer that specifies the minimum zoom level at which to display tiles from the source.<br/>The value should be between 0 and 22, inclusive, and less than<br/>maxZoomLevel, if specified. The default value for this option is 0.  |
| `maxZoomLevel`     |  `number`   |                  `none`                  | `false`  | An unsigned integer that specifies the maximum zoom level at which to display tiles from the source.<br/>The value should be between 0 and 22, inclusive, and less than<br/>minZoomLevel, if specified. The default value for this option is 22. |
| `tms`              |  `boolean`  |                  `none`                  | `false`  | Influences the y direction of the tile coordinates. (tms inverts y axis)                                                                                                                                                                         |
| `attribution`      |  `string`   |                  `none`                  | `false`  | An HTML or literal text string defining the buttons to be displayed in an action sheet when the<br/>source is part of a map view’s style and the map view’s attribution button is pressed.                                                       |
| `onPress`          |   `func`    |                  `none`                  | `false`  | Source press listener, gets called when a user presses one of the children layers only<br/>if that layer has a higher z-index than another source layers<br/>_signature:_`(event:OnPressEvent) => void`                                          |
| `hitbox`           |   `shape`   |                  `none`                  | `false`  | Overrides the default touch hitbox(44x44 pixels) for the source layers                                                                                                                                                                           |
| `  width`          |  `number`   |                  `none`                  |  `true`  | `width` of hitbox                                                                                                                                                                                                                                |
| `  height`         |  `number`   |                  `none`                  |  `true`  | `height` of hitbox                                                                                                                                                                                                                               |
| `children`         | `ReactNode` |                  `none`                  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                            |

## Methods

### `features([layerIDs], [filter])`

Returns all features that match the query parameters regardless of whether or not the feature is<br/>currently rendered on the map. The domain of the query includes all currently-loaded vector tiles<br/>and GeoJSON source tiles. This function does not check tiles outside of the visible viewport.

#### Arguments

| Name       |        Type        | Required | Description                                                                                                                                                           |
| ---------- | :----------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layerIDs` |      `Array`       |   `No`   | A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array. |
| `filter`   | `FilterExpression` |   `No`   | an optional filter statement to filter the returned Features.                                                                                                         |

```ts
vectorSource.features(["id1", "id2"]);
```

### `onPress(event)`

#### Arguments

| Name    |          Type          | Required | Description |
| ------- | :--------------------: | :------: | ----------- |
| `event` | `NativeSyntheticEvent` |  `Yes`   | undefined   |
