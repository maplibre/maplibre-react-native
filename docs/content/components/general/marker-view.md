---
# DO NOT MODIFY
# This file is auto-generated from src/components/MarkerView.tsx
sidebar_label: MarkerView
---

# `<MarkerView />`

MarkerView allows you to place an interactive React Native View on the map.<br/><br/>If you have static view consider using PointAnnotation or SymbolLayer they'll offer much better performance.<br/><br/>This is based on [MakerView plugin](https://github.com/maplibre/maplibre-plugins-android/tree/main/plugin-markerview) on Android<br/>and PointAnnotation on iOS.

## Props

| Prop           |      Type      |  Default   | Required | Description                                                                                                                                                                                                                                                                             |
| -------------- | :------------: | :--------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           |    `string`    |   `none`   | `false`  | A string that uniquely identifies the marker.                                                                                                                                                                                                                                           |
| `lngLat`       |    `LngLat`    |   `none`   |  `true`  | The center point (specified as a map coordinate) of the marker.<br/>See also #anchor.                                                                                                                                                                                                   |
| `anchor`       |    `Anchor`    | `"center"` | `false`  | Specifies the anchor being set on a particular point of the annotation.<br/>The anchor indicates which part of the marker should be placed closest to the coordinate.<br/>Defaults to "center".<br/><br/>@see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/ |
| `offset`       |  `PixelPoint`  |   `none`   | `false`  | The offset in pixels to apply relative to the anchor.<br/>Negative values indicate left and up.<br/><br/>@see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset                                                                                           |
| `allowOverlap` |   `boolean`    |  `false`   | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                   |
| `isSelected`   |   `boolean`    |  `false`   | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                                                   |
| `children`     | `ReactElement` |   `none`   |  `true`  | Expects one child - can be container with multiple elements                                                                                                                                                                                                                             |

## Methods

### `refresh()`
