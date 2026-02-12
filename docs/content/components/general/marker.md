---
# DO NOT MODIFY
# This file is auto-generated from src/components/Marker.tsx
sidebar_label: Marker
---

# `<Marker />`

Marker allows you to place an interactive React Native View on the map.<br/><br/>If you have static view consider using ViewAnnotation or SymbolLayer for better performance.<br/><br/>Implemented through:<br/>- Android: Native Views placed on the map projection<br/>- iOS: [MLNPointAnnotation](https://maplibre.org/maplibre-native/ios/latest/documentation/maplibre/mlnpointannotation/)

## Props

| Prop       |      Type      |  Default   | Required | Description                                                                                                                                                                                                                                                                             |
| ---------- | :------------: | :--------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       |    `string`    |   `none`   | `false`  | A string that uniquely identifies the marker.                                                                                                                                                                                                                                           |
| `lngLat`   |    `LngLat`    |   `none`   |  `true`  | The center point (specified as a map coordinate) of the marker.<br/>See also #anchor.                                                                                                                                                                                                   |
| `anchor`   |    `Anchor`    | `"center"` | `false`  | Specifies the anchor being set on a particular point of the annotation.<br/>The anchor indicates which part of the marker should be placed closest to the coordinate.<br/>Defaults to "center".<br/><br/>@see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PositionAnchor/ |
| `offset`   |  `PixelPoint`  |   `none`   | `false`  | The offset in pixels to apply relative to the anchor.<br/>Negative values indicate left and up.<br/><br/>@see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/#offset                                                                                           |
| `selected` |   `boolean`    |   `none`   | `false`  | Manually selects/deselects the marker.<br/><br/>@platform iOS                                                                                                                                                                                                                           |
| `children` | `ReactElement` |   `none`   |  `true`  | Expects one child - can be a View with multiple elements.                                                                                                                                                                                                                               |
| `ref`      |     `Ref`      |   `none`   | `false`  | Ref to access Marker methods.                                                                                                                                                                                                                                                           |

## Methods

### `getAnimatableRef()`
