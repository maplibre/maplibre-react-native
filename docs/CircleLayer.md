<!-- DO NOT MODIFY! -->
<!-- This file is auto-generated from javascript/components/CircleLayer.tsx -->
# <MapLibreGL.CircleLayer />
CircleLayer is a style layer that renders one or more filled circles on the map.

## Props
| Prop | Type | Default | Required | Description |
| ---- | :--: | :-----: | :------: | :----------: |
| style | `CircleLayerStyleProps` | `none` | `false` | Customizable style attributes |
| sourceID | `FIX ME UNKNOWN TYPE` | `MapLibreGL.StyleSource.DefaultSourceID` | `false` | FIX ME NO DESCRIPTION |


## Styles

* <a href="#name">circleSortKey</a><br/>
* <a href="#name-1">visibility</a><br/>
* <a href="#name-2">circleRadius</a><br/>
* <a href="#name-3">circleColor</a><br/>
* <a href="#name-4">circleBlur</a><br/>
* <a href="#name-5">circleOpacity</a><br/>
* <a href="#name-6">circleTranslate</a><br/>
* <a href="#name-7">circleTranslateAnchor</a><br/>
* <a href="#name-8">circlePitchScale</a><br/>
* <a href="#name-9">circlePitchAlignment</a><br/>
* <a href="#name-10">circleStrokeWidth</a><br/>
* <a href="#name-11">circleStrokeColor</a><br/>
* <a href="#name-12">circleStrokeOpacity</a><br/>

___

### `circleSortKey`

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

#### Type
`number`


#### Expression

Parameters: `zoom, feature`

___

### `visibility`

Whether this layer is displayed.

#### Type
`enum`
#### Default Value
`visible`

#### Supported Values
**visible** - The layer is shown.<br />
**none** - The layer is not shown.<br />



___

### `circleRadius`

Circle radius.

#### Type
`number`
#### Default Value
`5`

#### Units
`pixels`

#### Minimum
`0`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleRadiusTransition`

The transition affecting any changes to this layer’s circleRadius propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleColor`

The fill color of the circle.

#### Type
`color`
#### Default Value
`#000000`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleColorTransition`

The transition affecting any changes to this layer’s circleColor propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleBlur`

Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.

#### Type
`number`
#### Default Value
`0`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleBlurTransition`

The transition affecting any changes to this layer’s circleBlur propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleOpacity`

The opacity at which the circle will be drawn.

#### Type
`number`
#### Default Value
`1`

#### Minimum
`0`


#### Maximum
`1`

#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleOpacityTransition`

The transition affecting any changes to this layer’s circleOpacity propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleTranslate`

The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.

#### Type
`array<number>`
#### Default Value
`[0,0]`

#### Units
`pixels`


#### Expression

Parameters: `zoom`
___

### `circleTranslateTransition`

The transition affecting any changes to this layer’s circleTranslate propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleTranslateAnchor`

Controls the frame of reference for `circleTranslate`.

#### Type
`enum`
#### Default Value
`map`

#### Supported Values
**map** - The circle is translated relative to the map.<br />
**viewport** - The circle is translated relative to the viewport.<br />


#### Requires
`circleTranslate`

#### Expression

Parameters: `zoom`

___

### `circlePitchScale`

Controls the scaling behavior of the circle when the map is pitched.

#### Type
`enum`
#### Default Value
`map`

#### Supported Values
**map** - Circles are scaled according to their apparent distance to the camera.<br />
**viewport** - Circles are not scaled.<br />


#### Expression

Parameters: `zoom`

___

### `circlePitchAlignment`

Orientation of circle when map is pitched.

#### Type
`enum`
#### Default Value
`viewport`

#### Supported Values
**map** - The circle is aligned to the plane of the map.<br />
**viewport** - The circle is aligned to the plane of the viewport.<br />


#### Expression

Parameters: `zoom`

___

### `circleStrokeWidth`

The width of the circle's stroke. Strokes are placed outside of the `circleRadius`.

#### Type
`number`
#### Default Value
`0`

#### Units
`pixels`

#### Minimum
`0`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleStrokeWidthTransition`

The transition affecting any changes to this layer’s circleStrokeWidth propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleStrokeColor`

The stroke color of the circle.

#### Type
`color`
#### Default Value
`#000000`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleStrokeColorTransition`

The transition affecting any changes to this layer’s circleStrokeColor propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `circleStrokeOpacity`

The opacity of the circle's stroke.

#### Type
`number`
#### Default Value
`1`

#### Minimum
`0`


#### Maximum
`1`

#### Expression

Parameters: `zoom, feature, feature-state`
___

### `circleStrokeOpacityTransition`

The transition affecting any changes to this layer’s circleStrokeOpacity propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


