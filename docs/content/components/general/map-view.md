---
# DO NOT MODIFY
# This file is auto-generated from src/components/MapView.tsx
sidebar_label: MapView
---

# `<MapView />`

MapView backed by MapLibre Native

## Props

| Prop                             |           Type           |   Default   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------- | :----------------------: | :---------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                       |       `ReactNode`        |   `none`    | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `style`                          |   `ViewProps["style"]`   |   `none`    | `false`  | Style for wrapping React Native View                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `mapStyle`                       |    `string \| object`    |   `none`    | `false`  | Style for map - either a URL or a Style JSON (https://maplibre.org/maplibre-style-spec/). Default: `StyleURL.Default`                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `contentInset`                   |      `ViewPadding`       |   `none`    | `false`  | The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `preferredFramesPerSecond`       |         `number`         |   `none`    | `false`  | iOS: The preferred frame rate at which the map view is rendered.<br/>The default value for this property is MLNMapViewPreferredFramesPerSecondDefault,<br/>which will adaptively set the preferred frame rate based on the capability of<br/>the user’s device to maintain a smooth experience. This property can be set to arbitrary integer values.<br/><br/>Android: The maximum frame rate at which the map view is rendered, but it can't excess the ability of device hardware.<br/>This property can be set to arbitrary integer values. |
| `scrollEnabled`                  |        `boolean`         |   `none`    | `false`  | Enable/Disable scroll on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `zoomEnabled`                    |        `boolean`         |   `none`    | `false`  | Enable/Disable zoom on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `rotateEnabled`                  |        `boolean`         |   `none`    | `false`  | Enable/Disable rotation on map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `pitchEnabled`                   |        `boolean`         |   `none`    | `false`  | Enable/Disable pitch on map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `tintColor`                      |         `string`         |   `none`    | `false`  | Tints UI elements like the attribution button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `attribution`                    |        `boolean`         |   `none`    | `false`  | Enable/Disable attribution on map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `attributionPosition`            |      `ViewPosition`      |   `none`    | `false`  | Positions the attribution<br/><br/>@example<br/>{ top: 8, left: 8 } // Position in the top-left corner                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `logo`                           |        `boolean`         |   `none`    | `false`  | Enable/Disable the logo on the map.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `logoPosition`                   |      `ViewPosition`      |   `none`    | `false`  | Positions the logo<br/><br/>@example<br/>{ top: 8, left: 8 } // Position in the top-left corner                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `compass`                        |        `boolean`         |   `none`    | `false`  | Enable/Disable the compass from appearing on the map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `compassPosition`                |      `ViewPosition`      |   `none`    | `false`  | Positions the compass<br/><br/>@example<br/>{ top: 8, left: 8 } // Position in the top-left corner                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `androidViewMode`                | `"surface" \| "texture"` | `"surface"` | `false`  | [Android only] Enable/Disable use of GLSurfaceView instead of TextureView<br/><br/>@default "surface"                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `onPress`                        |          `func`          |   `none`    | `false`  | Map press listener, gets called when a user presses the map<br/>_signature:_`(feature:GeoJSON.Feature) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onLongPress`                    |          `func`          |   `none`    | `false`  | Map long press listener, gets called when a user long presses the map<br/>_signature:_`(feature:GeoJSON.Feature) => void`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onRegionWillChange`             |          `func`          |   `none`    | `false`  | Called when the currently displayed map region is about to change<br/>_signature:_`(feature:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onRegionIsChanging`             |          `func`          |   `none`    | `false`  | Called when the currently displayed map region is changing<br/>_signature:_`(feature:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `onRegionDidChange`              |          `func`          |   `none`    | `false`  | Called when the currently displayed map region finished changing<br/>_signature:_`(feature:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onWillStartLoadingMap`          |          `func`          |   `none`    | `false`  | Called when the map is about to start loading a new map style<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `onDidFinishLoadingMap`          |          `func`          |   `none`    | `false`  | Called when the map has successfully loaded a new map style<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `onDidFailLoadingMap`            |          `func`          |   `none`    | `false`  | Called when the map has failed to load a new map style<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `onWillStartRenderingFrame`      |          `func`          |   `none`    | `false`  | Called when the map will start rendering a frame<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onDidFinishRenderingFrame`      |          `func`          |   `none`    | `false`  | Called when the map finished rendering a frame<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `onDidFinishRenderingFrameFully` |          `func`          |   `none`    | `false`  | Called when the map fully finished rendering a frame<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onWillStartRenderingMap`        |          `func`          |   `none`    | `false`  | Called when the map will start rendering itself<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `onDidFinishRenderingMap`        |          `func`          |   `none`    | `false`  | Called when the map has finished rendering itself<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `onDidFinishRenderingMapFully`   |          `func`          |   `none`    | `false`  | Called when the map has fully finished rendering itself<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onDidFinishLoadingStyle`        |          `func`          |   `none`    | `false`  | Triggered when a style has finished loading<br/>_signature:_`(event:NativeSyntheticEvent) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Methods

### `getCenter()`

### `getZoom()`

### `getBearing()`

### `getPitch()`

### `getBounds()`

### `getViewState()`

### `getPointInView(coordinate)`

#### Arguments

| Name         | Type  | Required | Description |
| ------------ | :---: | :------: | ----------- |
| `coordinate` | `n/a` |  `Yes`   | undefined   |

### `getCoordinateFromView(point)`

#### Arguments

| Name    | Type  | Required | Description |
| ------- | :---: | :------: | ----------- |
| `point` | `n/a` |  `Yes`   | undefined   |

### `queryRenderedFeaturesAtPoint(point, filter, [layerIds])`

#### Arguments

| Name       | Type  | Required | Description |
| ---------- | :---: | :------: | ----------- |
| `point`    | `n/a` |  `Yes`   | undefined   |
| `filter`   | `n/a` |  `Yes`   | undefined   |
| `layerIds` | `n/a` |   `No`   | undefined   |

### `queryRenderedFeaturesInRect(bbox, filter, [layerIds])`

#### Arguments

| Name       | Type  | Required | Description |
| ---------- | :---: | :------: | ----------- |
| `bbox`     | `n/a` |  `Yes`   | undefined   |
| `filter`   | `n/a` |  `Yes`   | undefined   |
| `layerIds` | `n/a` |   `No`   | undefined   |

### `takeSnap([writeToDisk])`

#### Arguments

| Name          | Type  | Required | Description |
| ------------- | :---: | :------: | ----------- |
| `writeToDisk` | `n/a` |   `No`   | undefined   |

### `setSourceVisibility(visible, sourceId, sourceLayerId)`

#### Arguments

| Name            | Type  | Required | Description |
| --------------- | :---: | :------: | ----------- |
| `visible`       | `n/a` |  `Yes`   | undefined   |
| `sourceId`      | `n/a` |  `Yes`   | undefined   |
| `sourceLayerId` | `n/a` |  `Yes`   | undefined   |

### `showAttribution()`
