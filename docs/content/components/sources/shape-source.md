---
# DO NOT MODIFY
# This file is auto-generated from src/components/ShapeSource.tsx
sidebar_label: ShapeSource
---

# `<ShapeSource />`

ShapeSource is a map content source that supplies vector shapes to be shown on the map.<br/>The shape may be a url or a GeoJSON object

## Props

| Prop                  |                                               Type                                               |                 Default                  | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | :----------------------------------------------------------------------------------------------: | :--------------------------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  |                                             `string`                                             | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | A string that uniquely identifies the source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `url`                 |                                             `string`                                             |                  `none`                  | `false`  | An HTTP(S) URL, absolute file URL, or local file URL relative to the current application’s resource bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `shape`               | `GeoJSON.GeometryCollection \| GeoJSON.Feature \| GeoJSON.FeatureCollection \| GeoJSON.Geometry` |                  `none`                  | `false`  | The contents of the source. A shape can represent a GeoJSON geometry, a feature, or a feature colllection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `cluster`             |                                            `boolean`                                             |                  `none`                  | `false`  | Enables clustering on the source for point shapes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `clusterRadius`       |                                             `number`                                             |                  `none`                  | `false`  | Specifies the radius of each cluster if clustering is enabled.<br/>A value of 512 produces a radius equal to the width of a tile.<br/>The default value is 50.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `clusterMinPoints`    |                                             `number`                                             |                  `none`                  | `false`  | Specifies minimum number of points to form a cluster if clustering is enabled.<br/>The default value is 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `clusterMaxZoomLevel` |                                             `number`                                             |                  `none`                  | `false`  | Specifies the maximum zoom level at which to cluster points if clustering is enabled.<br/>Defaults to one zoom level less than the value of maxZoomLevel so that, at the maximum zoom level,<br/>the shapes are not clustered.                                                                                                                                                                                                                                                                                                                                            |
| `clusterProperties`   |                                             `shape`                                              |                  `none`                  | `false`  | Specifies custom properties on the generated clusters if clustering<br/>is enabled, aggregating values from clustered points.<br/><br/>Has the form `{ "property_name": [operator, map_expression]}`, where<br/> `operator` is a custom reduce expression that references a special `["accumulated"]` value -<br/> it accumulates the property value from clusters/points the cluster contains<br/> `map_expression` produces the value of a single point<br/><br/>@example `{ "resultingSum": [["+", ["accumulated"], ["get", "resultingSum"]], ["get", "scalerank"]] }` |
| `  [object Object]`   |                                        `ExpressionField`                                         |                  `none`                  |  `true`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `maxZoomLevel`        |                                             `number`                                             |                  `none`                  | `false`  | Specifies the maximum zoom level at which to create vector tiles.<br/>A greater value produces greater detail at high zoom levels.<br/>The default value is 18.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `buffer`              |                                             `number`                                             |                  `none`                  | `false`  | Specifies the size of the tile buffer on each side.<br/>A value of 0 produces no buffer. A value of 512 produces a buffer as wide as the tile itself.<br/>Larger values produce fewer rendering artifacts near tile edges and slower performance.<br/>The default value is 128.                                                                                                                                                                                                                                                                                           |
| `tolerance`           |                                             `number`                                             |                  `none`                  | `false`  | Specifies the Douglas-Peucker simplification tolerance.<br/>A greater value produces simpler geometries and improves performance.<br/>The default value is 0.375.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `lineMetrics`         |                                            `boolean`                                             |                  `none`                  | `false`  | Whether to calculate line distance metrics.<br/>This is required for line layers that specify lineGradient values.<br/>The default value is false.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `onPress`             |                                              `func`                                              |                  `none`                  | `false`  | Source press listener, gets called when a user presses one of the children layers only if that layer has a higher z-index than another source layers.<br/>_signature:_`(event:OnPressEvent) => void`                                                                                                                                                                                                                                                                                                                                                                      |
| `hitbox`              |                                             `shape`                                              |                  `none`                  | `false`  | Overrides the default touch hitbox (44x44 pixels) for the source layers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `  width`             |                                             `number`                                             |                  `none`                  |  `true`  | `width` of hitbox                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `  height`            |                                             `number`                                             |                  `none`                  |  `true`  | `height` of hitbox                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `children`            |                                           `ReactNode`                                            |                  `none`                  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Methods

### `features([filter])`

Returns all features from the source that match the query parameters regardless of whether or not the feature is<br/>currently rendered on the map.

#### Arguments

| Name     |        Type        | Required | Description                                                   |
| -------- | :----------------: | :------: | ------------------------------------------------------------- |
| `filter` | `FilterExpression` |   `No`   | an optional filter statement to filter the returned Features. |

```ts
shapeSource.features();
```

### `getClusterExpansionZoom(feature)`

Returns the zoom needed to expand the cluster.

#### Arguments

| Name      |       Type        | Required | Description                    |
| --------- | :---------------: | :------: | ------------------------------ |
| `feature` | `GeoJSON.Feature` |  `Yes`   | The feature cluster to expand. |

```ts
const zoom = await shapeSource.getClusterExpansionZoom(clusterId);
```

### `getClusterLeaves(feature, limit, offset)`

Returns the FeatureCollection from the cluster.

#### Arguments

| Name      |       Type        | Required | Description                                    |
| --------- | :---------------: | :------: | ---------------------------------------------- |
| `feature` | `GeoJSON.Feature` |  `Yes`   | The feature cluster to expand.                 |
| `limit`   |     `number`      |  `Yes`   | The number of points to return.                |
| `offset`  |     `number`      |  `Yes`   | The amount of points to skip (for pagination). |

```ts
const collection = await shapeSource.getClusterLeaves(clusterId, limit, offset);
```

### `getClusterChildren(feature)`

Returns the FeatureCollection from the cluster (on the next zoom level).

#### Arguments

| Name      |       Type        | Required | Description                    |
| --------- | :---------------: | :------: | ------------------------------ |
| `feature` | `GeoJSON.Feature` |  `Yes`   | The feature cluster to expand. |

```ts
const collection = await shapeSource.getClusterChildren(clusterId);
```

### `onPress(event)`

#### Arguments

| Name    |          Type          | Required | Description |
| ------- | :--------------------: | :------: | ----------- |
| `event` | `NativeSyntheticEvent` |  `Yes`   | undefined   |
