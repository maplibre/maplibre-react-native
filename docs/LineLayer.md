<!-- DO NOT MODIFY! -->
<!-- This file is auto-generated from javascript/components/LineLayer.tsx -->
# <MapLibreGL.LineLayer />
LineLayer is a style layer that renders one or more stroked polylines on the map.

## Props
| Prop | Type | Default | Required | Description |
| ---- | :--: | :-----: | :------: | :----------: |
| style | `LineLayerStyleProps` | `none` | `false` | Customizable style attributes |
| sourceID | `FIX ME UNKNOWN TYPE` | `MapLibreGL.StyleSource.DefaultSourceID` | `false` | FIX ME NO DESCRIPTION |


## Styles

* <a href="#name">`lineCap`</a><br/>
* <a href="#name-1">`lineJoin`</a><br/>
* <a href="#name-2">`lineMiterLimit`</a><br/>
* <a href="#name-3">`lineRoundLimit`</a><br/>
* <a href="#name-4">`lineSortKey`</a><br/>
* <a href="#name-5">`visibility`</a><br/>
* <a href="#name-6">`lineOpacity`</a><br/>
* <a href="#name-7">`lineColor`</a><br/>
* <a href="#name-8">`lineTranslate`</a><br/>
* <a href="#name-9">`lineTranslateAnchor`</a><br/>
* <a href="#name-10">`lineWidth`</a><br/>
* <a href="#name-11">`lineGapWidth`</a><br/>
* <a href="#name-12">`lineOffset`</a><br/>
* <a href="#name-13">`lineBlur`</a><br/>
* <a href="#name-14">`lineDasharray`</a><br/>
* <a href="#name-15">`linePattern`</a><br/>
* <a href="#name-16">`lineGradient`</a><br/>


### `lineCap`

The display of line endings.

#### Type
`enum`
#### Default Value
`butt`

#### Supported Values
**butt** - A cap with a squared-off end which is drawn to the exact endpoint of the line.<br />
**round** - A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br />
**square** - A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.<br />


#### Expression

Parameters: `zoom`


### `lineJoin`

The display of lines when joining.

#### Type
`enum`
#### Default Value
`miter`

#### Supported Values
**bevel** - A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.<br />
**round** - A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br />
**miter** - A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet.<br />


#### Supported Style Functions
`camera`
#### Expression

Parameters: `zoom, feature`


### `lineMiterLimit`

Used to automatically convert miter joins to bevel joins for sharp angles.

#### Type
`number`
#### Default Value
`2`


#### Expression

Parameters: `zoom`


### `lineRoundLimit`

Used to automatically convert round joins to miter joins for shallow angles.

#### Type
`number`
#### Default Value
`1.05`


#### Expression

Parameters: `zoom`


### `lineSortKey`

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

#### Type
`number`


#### Expression

Parameters: `zoom, feature`


### `visibility`

Whether this layer is displayed.

#### Type
`enum`
#### Default Value
`visible`

#### Supported Values
**visible** - The layer is shown.<br />
**none** - The layer is not shown.<br />




### `lineOpacity`

The opacity at which the line will be drawn.

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

### `lineOpacityTransition`

The transition affecting any changes to this layer’s lineOpacity propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineColor`

The color with which the line will be drawn.

#### Type
`color`
#### Default Value
`#000000`


#### Disabled By
`linePattern`

#### Expression

Parameters: `zoom, feature, feature-state`
___

### `lineColorTransition`

The transition affecting any changes to this layer’s lineColor propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineTranslate`

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

### `lineTranslateTransition`

The transition affecting any changes to this layer’s lineTranslate propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineTranslateAnchor`

Controls the frame of reference for `lineTranslate`.

#### Type
`enum`
#### Default Value
`map`

#### Supported Values
**map** - The line is translated relative to the map.<br />
**viewport** - The line is translated relative to the viewport.<br />


#### Requires
`lineTranslate`

#### Expression

Parameters: `zoom`


### `lineWidth`

Stroke thickness.

#### Type
`number`
#### Default Value
`1`

#### Units
`pixels`

#### Minimum
`0`


#### Supported Style Functions
`camera`
#### Expression

Parameters: `zoom, feature, feature-state`
___

### `lineWidthTransition`

The transition affecting any changes to this layer’s lineWidth propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineGapWidth`

Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.

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

### `lineGapWidthTransition`

The transition affecting any changes to this layer’s lineGapWidth propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineOffset`

The line's offset. For linear features, a positive value offsets the line to the right, relative to the direction of the line, and a negative value to the left. For polygon features, a positive value results in an inset, and a negative value results in an outset.

#### Type
`number`
#### Default Value
`0`

#### Units
`pixels`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `lineOffsetTransition`

The transition affecting any changes to this layer’s lineOffset propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineBlur`

Blur applied to the line, in pixels.

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

### `lineBlurTransition`

The transition affecting any changes to this layer’s lineBlur propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineDasharray`

Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width. Note that GeoJSON sources with `lineMetrics: true` specified won't render dashed lines to the expected scale. Also note that zoomDependent expressions will be evaluated only at integer zoom levels.

#### Type
`array<number>`

#### Units
`line widths`

#### Minimum
`0`


#### Disabled By
`linePattern`

#### Expression

Parameters: `zoom`
___

### `lineDasharrayTransition`

The transition affecting any changes to this layer’s lineDasharray propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `linePattern`

Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

#### Type
`resolvedImage`


#### Expression

Parameters: `zoom, feature`
___

### `linePatternTransition`

The transition affecting any changes to this layer’s linePattern propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`



### `lineGradient`

Defines a gradient with which to color a line feature. Can only be used with GeoJSON sources that specify `"lineMetrics": true`.

#### Type
`color`


#### Disabled By
`lineDasharray, linePattern`

#### Expression

Parameters: `line-progress`

