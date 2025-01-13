---
# DO NOT MODIFY
# This file is auto-generated from src/components/MapView.tsx
sidebar_label: MapView
---

# `<MapView />`

MapView backed by MapLibre Native

## Props

| Prop                           |                                                                        Type                                                                        | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contentInset`                 |                                                                `number[] \| number`                                                                | `none`  | `false`  | The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `style`                        |                                                                `ViewProps["style"]`                                                                | `none`  | `false`  | Style for wrapping React Native View                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `mapStyle`                     |                                                                 `string \| object`                                                                 | `none`  | `false`  | Style for map - either a URL or a Style JSON (https://maplibre.org/maplibre-style-spec/). Default: `StyleURL.Default`                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `preferredFramesPerSecond`     |                                                                      `number`                                                                      | `none`  | `false`  | iOS: The preferred frame rate at which the map view is rendered.<br/>The default value for this property is MLNMapViewPreferredFramesPerSecondDefault,<br/>which will adaptively set the preferred frame rate based on the capability of<br/>the user’s device to maintain a smooth experience. This property can be set to arbitrary integer values.<br/><br/>Android: The maximum frame rate at which the map view is rendered, but it can't excess the ability of device hardware.<br/>This property can be set to arbitrary integer values. |
| `localizeLabels`               |                                                                     `boolean`                                                                      | `false` | `false`  | Automatically change the language of the map labels to the system’s preferred language,<br/>this is not something that can be toggled on/off                                                                                                                                                                                                                                                                                                                                                                                                    |
| `zoomEnabled`                  |                                                                     `boolean`                                                                      | `none`  | `false`  | Enable/Disable zoom on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `scrollEnabled`                |                                                                     `boolean`                                                                      | `true`  | `false`  | Enable/Disable scroll on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `pitchEnabled`                 |                                                                     `boolean`                                                                      | `true`  | `false`  | Enable/Disable pitch on map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `rotateEnabled`                |                                                                     `boolean`                                                                      | `true`  | `false`  | Enable/Disable rotation on map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `attributionEnabled`           |                                                                     `boolean`                                                                      | `true`  | `false`  | Enable/Disable attribution on map.<br/><br/>This must be enabled for Mapbox-hosted tiles and styles. Please refer to the Mapbox Terms of Service.<br/>Other providers do not require this.                                                                                                                                                                                                                                                                                                                                                      |
| `attributionPosition`          | `{ top?: number; left?: number } \| { top?: number; right?: number } \| { bottom?: number; left?: number } \| { bottom?: number; right?: number }` | `none`  | `false`  | Adds attribution offset, e.g. `{top: 8, left: 8}` will put attribution button in top-left corner of the map                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `tintColor`                    |                                                               `string \| unknown[]`                                                                | `none`  | `false`  | MapView's tintColor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `logoEnabled`                  |                                                                     `boolean`                                                                      | `false` | `false`  | Enable/Disable the logo on the map.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `logoPosition`                 | `{ top?: number; left?: number } \| { top?: number; right?: number } \| { bottom?: number; left?: number } \| { bottom?: number; right?: number }` | `none`  | `false`  | Adds logo offset, e.g. `{top: 8, left: 8}` will put the logo in top-left corner of the map                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `compassEnabled`               |                                                                     `boolean`                                                                      | `none`  | `false`  | Enable/Disable the compass from appearing on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `compassViewPosition`          |                                                                      `number`                                                                      | `none`  | `false`  | Change corner of map the compass starts at. 0: TopLeft, 1: TopRight, 2: BottomLeft, 3: BottomRight                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `compassViewMargins`           |                                                                      `object`                                                                      | `none`  | `false`  | Add margins to the compass with x and y values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `surfaceView`                  |                                                                     `boolean`                                                                      | `false` | `false`  | [Android only] Enable/Disable use of GLSurfaceView insted of TextureView.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onUserLocationUpdate`         |                                                                       `func`                                                                       | `none`  | `false`  | This event is triggered when the user location is updated.<br/>_signature:_`(location:Location) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `regionWillChangeDebounceTime` |                                                                      `number`                                                                      |  `10`   | `false`  | The emitted frequency of regionwillchange events                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `regionDidChangeDebounceTime`  |                                                                      `number`                                                                      |  `500`  | `false`  | The emitted frequency of regiondidchange events                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `children`                     |                                                                    `ReactNode`                                                                     | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Methods

### `getPointInView(coordinate)`

Converts a geographic coordinate to a pixel point of the view.

#### Arguments

| Name         |        Type        | Required | Description           |
| ------------ | :----------------: | :------: | --------------------- |
| `coordinate` | `GeoJSON.Position` |  `Yes`   | Geographic coordinate |

```ts
const pointInView = await mapViewRef.current?.getPointInView([
  -37.81707, 144.949901,
]);
```

### `getCoordinateFromView(point)`

Converts a pixel point of the view to a geographic coordinate.

#### Arguments

| Name    |  Type   | Required | Description |
| ------- | :-----: | :------: | ----------- |
| `point` | `tuple` |  `Yes`   | undefined   |

```ts
const coordinate = await mapViewRef.current?.getCoordinateFromView([100, 100]);
```

### `getVisibleBounds()`

The coordinate bounds(ne, sw) visible in the users’s viewport.

```ts
const visibleBounds = await this._map.getVisibleBounds();
```

### `queryRenderedFeaturesAtPoint(point, [filter], [layerIDs])`

Returns an array of rendered map features that intersect with a given point.

#### Arguments

| Name       |        Type        | Required | Description                                                                                                                                                           |
| ---------- | :----------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `point`    |      `tuple`       |  `Yes`   | undefined                                                                                                                                                             |
| `filter`   | `FilterExpression` |   `No`   | A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array. |
| `layerIDs` |      `Array`       |   `No`   | A array of layer id's to filter the features by                                                                                                                       |

```ts
this._map.queryRenderedFeaturesAtPoint(
  [30, 40],
  ["==", "type", "Point"],
  ["id1", "id2"],
);
```

### `queryRenderedFeaturesInRect(bbox, [filter], [layerIDs])`

Returns an array of rendered map features that intersect with the given rectangle,<br/>restricted to the given style layers and filtered by the given predicate.

#### Arguments

| Name       |        Type        | Required | Description                                                                                                                                                           |
| ---------- | :----------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bbox`     |   `GeoJSON.BBox`   |  `Yes`   | A rectangle expressed in the map view’s coordinate system.                                                                                                            |
| `filter`   | `FilterExpression` |   `No`   | A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array. |
| `layerIDs` |      `Array`       |   `No`   | A array of layer id's to filter the features by                                                                                                                       |

```ts
this._map.queryRenderedFeaturesInRect(
  [30, 40, 20, 10],
  ["==", "type", "Point"],
  ["id1", "id2"],
);
```

### `takeSnap([writeToDisk])`

Takes snapshot of map with current tiles and returns a URI to the image

#### Arguments

| Name          |   Type    | Required | Description                                                |
| ------------- | :-------: | :------: | ---------------------------------------------------------- |
| `writeToDisk` | `boolean` |   `No`   | If true will create a temp file, otherwise it is in base64 |

### `getZoom()`

Returns the current zoom of the map view.

```ts
const zoom = await this._map.getZoom();
```

### `getCenter()`

Returns the map's geographical centerpoint

```ts
const center = await this._map.getCenter();
```

### `setSourceVisibility(visible, sourceId, [sourceLayerId])`

Sets the visibility of all the layers referencing the specified `sourceLayerId` and/or `sourceId`

#### Arguments

| Name            |   Type    | Required | Description                                             |
| --------------- | :-------: | :------: | ------------------------------------------------------- |
| `visible`       | `boolean` |  `Yes`   | Visibility of the layers                                |
| `sourceId`      | `string`  |  `Yes`   | Identifier of the target source (e.g. 'composite')      |
| `sourceLayerId` | `string`  |   `No`   | Identifier of the target source-layer (e.g. 'building') |

```ts
await this._map.setSourceVisibility(false, "composite", "building");
```

### `showAttribution()`

Show the attribution and telemetry action sheet.<br/>If you implement a custom attribution button, you should add this action to the button.
