<!-- DO NOT MODIFY -->
<!-- This file is auto-generated from src/components/PointAnnotation.tsx -->
# `<PointAnnotation />`
PointAnnotation represents a one-dimensional shape located at a single geographical coordinate.<br/><br/>Consider using ShapeSource and SymbolLayer instead, if you have many points and you have static images,<br/>they'll offer much better performance<br/><br/>.<br/>If you need interctive views please use MarkerView,<br/>as with PointAnnotation on Android child views are rendered onto a bitmap for better performance.

## Props
| Prop | Type | Default | Required | Description |
| ---- | :--: | :-----: | :------: | :----------: |
| id | `string` | `none` | `true` | A string that uniquely identifies the annotation |
| title | `string` | `none` | `false` | The string containing the annotation’s title. Note this is required to be set if you want to see a callout appear on iOS. |
| snippet | `string` | `none` | `false` | The string containing the annotation’s snippet(subtitle). Not displayed in the default callout. |
| selected | `boolean` | `none` | `false` | Manually selects/deselects annotation<br/>@type {[type]} |
| draggable | `boolean` | `false` | `false` | Enable or disable dragging. Defaults to false. |
| coordinate | `Array` | `none` | `true` | The center point (specified as a map coordinate) of the annotation. |
| anchor | `shape` | `{ x: 0.5, y: 0.5 }` | `false` | Specifies the anchor being set on a particular point of the annotation.<br/>The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],<br/>where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.<br/>Note this is only for custom annotations not the default pin view.<br/>Defaults to the center of the view. |
| &nbsp;&nbsp;x | `number` | `none` | `true` | See anchor |
| &nbsp;&nbsp;y | `number` | `none` | `true` | See anchor |
| children | `ReactElement \| [ReactElement, ReactElement]` | `none` | `true` | Expects one child, and an optional callout can be added as well |
| style | `ViewProps["style"]` | `none` | `false` | FIX ME NO DESCRIPTION |

## Methods
### `refresh()`

On android point annotation is rendered offscreen with a canvas into an image.<br/>To rerender the image from the current state of the view call refresh.<br/>Call this for example from Image#onLoad.



