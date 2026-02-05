---
# DO NOT MODIFY
# This file is auto-generated from src/components/GeoJSONSource.tsx
sidebar_label: GeoJSONSource
---

# `<GeoJSONSource />`

GeoJSONSource is a map content source that supplies GeoJSON to be shown on the map.<br/>The data may be provided as an url or a GeoJSON object.

## Props

| Prop                |                       Type                        | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | :-----------------------------------------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                |                     `string`                      | `none`  | `false`  | A string that uniquely identifies the source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data`              |            `string \| GeoJSON.GeoJSON`            | `none`  |  `true`  | Can be provided as one of:<br/>- An HTTP(S) URL, absolute file URL, or local file URL relative to the current application’s resource bundle<br/>- Any valid GeoJSON object                                                                                                                                                                                                                                                                                                                                                                                                |
| `cluster`           |                     `boolean`                     | `none`  | `false`  | Enables clustering on the source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `clusterRadius`     |                     `number`                      | `none`  | `false`  | Specifies the radius of each cluster if clustering is enabled.<br/>A value of 512 produces a radius equal to the width of a tile.<br/>The default value is 50.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `clusterMinPoints`  |                     `number`                      | `none`  | `false`  | Specifies minimum number of points to form a cluster if clustering is enabled.<br/>The default value is 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `clusterMaxZoom`    |                     `number`                      | `none`  | `false`  | Specifies the maximum zoom level at which to cluster points if clustering is enabled.<br/>Defaults to one zoom level less than the value of maxzoom so that, at the maximum zoom,<br/>the data is not clustered.                                                                                                                                                                                                                                                                                                                                                          |
| `clusterProperties` | `GeoJSONSourceSpecification["clusterProperties"]` | `none`  | `false`  | Specifies custom properties on the generated clusters if clustering<br/>is enabled, aggregating values from clustered points.<br/><br/>Has the form `{ "property_name": [operator, map_expression]}`, where<br/> `operator` is a custom reduce expression that references a special `["accumulated"]` value -<br/> it accumulates the property value from clusters/points the cluster contains<br/> `map_expression` produces the value of a single point<br/><br/>@example `{ "resultingSum": [["+", ["accumulated"], ["get", "resultingSum"]], ["get", "scalerank"]] }` |
| `maxzoom`           |                     `number`                      | `none`  | `false`  | Specifies the maximum zoom level at which to create vector tiles.<br/>A greater value produces greater detail at high zoom levels.<br/>The default value is 18.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `buffer`            |                     `number`                      | `none`  | `false`  | Specifies the size of the tile buffer on each side.<br/>A value of 0 produces no buffer. A value of 512 produces a buffer as wide as the tile itself.<br/>Larger values produce fewer rendering artifacts near tile edges and slower performance.<br/>The default value is 128.                                                                                                                                                                                                                                                                                           |
| `tolerance`         |                     `number`                      | `none`  | `false`  | Douglas-Peucker simplification tolerance applied to geometries<br/><br/>Higher means simpler geometries and faster performance.<br/><br/>@default 0.375                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lineMetrics`       |                     `boolean`                     | `none`  | `false`  | Whether to calculate line distance metrics.<br/>This is required for line layers that specify lineGradient values.<br/>The default value is false.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `children`          |                    `ReactNode`                    | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Methods

### `getData(filter)`

#### Arguments

| Name     | Type  | Required | Description |
| -------- | :---: | :------: | ----------- |
| `filter` | `n/a` |  `Yes`   | undefined   |

### `getClusterExpansionZoom(clusterId)`

#### Arguments

| Name        | Type  | Required | Description |
| ----------- | :---: | :------: | ----------- |
| `clusterId` | `n/a` |  `Yes`   | undefined   |

### `getClusterLeaves(clusterId, limit, offset)`

#### Arguments

| Name        |   Type   | Required | Description |
| ----------- | :------: | :------: | ----------- |
| `clusterId` | `number` |  `Yes`   | undefined   |
| `limit`     | `number` |  `Yes`   | undefined   |
| `offset`    | `number` |  `Yes`   | undefined   |

### `getClusterChildren(clusterId)`

#### Arguments

| Name        |   Type   | Required | Description |
| ----------- | :------: | :------: | ----------- |
| `clusterId` | `number` |  `Yes`   | undefined   |
