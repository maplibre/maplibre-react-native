<!-- DO NOT MODIFY! -->
<!-- This file is auto-generated from javascript/components/FillExtrusionLayer.tsx -->
# <MapLibreGL.FillExtrusionLayer />
FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.

## Props
| Prop | Type | Default | Required | Description |
| ---- | :--: | :-----: | :------: | :----------: |
| style | `FillExtrusionLayerStyleProps` | `none` | `false` | Customizable style attributes |
| sourceID | `FIX ME UNKNOWN TYPE` | `MapLibreGL.StyleSource.DefaultSourceID` | `false` | FIX ME NO DESCRIPTION |


## Styles

* <a href="#name">visibility</a><br/>
* <a href="#name-1">fillExtrusionOpacity</a><br/>
* <a href="#name-2">fillExtrusionColor</a><br/>
* <a href="#name-3">fillExtrusionTranslate</a><br/>
* <a href="#name-4">fillExtrusionTranslateAnchor</a><br/>
* <a href="#name-5">fillExtrusionPattern</a><br/>
* <a href="#name-6">fillExtrusionHeight</a><br/>
* <a href="#name-7">fillExtrusionBase</a><br/>
* <a href="#name-8">fillExtrusionVerticalGradient</a><br/>

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

### `fillExtrusionOpacity`

The opacity of the entire fill extrusion layer. This is rendered on a perLayer, not perFeature, basis, and dataDriven styling is not available.

#### Type
`number`
#### Default Value
`1`

#### Minimum
`0`


#### Maximum
`1`

#### Expression

Parameters: `zoom`
___

### `fillExtrusionOpacityTransition`

The transition affecting any changes to this layer’s fillExtrusionOpacity propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionColor`

The base color of the extruded fill. The extrusion's surfaces will be shaded differently based on this color in combination with the root `light` settings. If this color is specified as `rgba` with an alpha component, the alpha component will be ignored; use `fillExtrusionOpacity` to set layer opacity.

#### Type
`color`
#### Default Value
`#000000`


#### Disabled By
`fillExtrusionPattern`

#### Expression

Parameters: `zoom, feature, feature-state`
___

### `fillExtrusionColorTransition`

The transition affecting any changes to this layer’s fillExtrusionColor propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionTranslate`

The geometry's offset. Values are [x, y] where negatives indicate left and up (on the flat plane), respectively.

#### Type
`array<number>`
#### Default Value
`[0,0]`

#### Units
`pixels`


#### Expression

Parameters: `zoom`
___

### `fillExtrusionTranslateTransition`

The transition affecting any changes to this layer’s fillExtrusionTranslate propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionTranslateAnchor`

Controls the frame of reference for `fillExtrusionTranslate`.

#### Type
`enum`
#### Default Value
`map`

#### Supported Values
**map** - The fill extrusion is translated relative to the map.<br />
**viewport** - The fill extrusion is translated relative to the viewport.<br />


#### Requires
`fillExtrusionTranslate`

#### Expression

Parameters: `zoom`

___

### `fillExtrusionPattern`

Name of image in sprite to use for drawing images on extruded fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

#### Type
`resolvedImage`


#### Expression

Parameters: `zoom, feature`
___

### `fillExtrusionPatternTransition`

The transition affecting any changes to this layer’s fillExtrusionPattern propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionHeight`

The height with which to extrude this layer.

#### Type
`number`
#### Default Value
`0`

#### Units
`meters`

#### Minimum
`0`


#### Expression

Parameters: `zoom, feature, feature-state`
___

### `fillExtrusionHeightTransition`

The transition affecting any changes to this layer’s fillExtrusionHeight propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionBase`

The height with which to extrude the base of this layer. Must be less than or equal to `fillExtrusionHeight`.

#### Type
`number`
#### Default Value
`0`

#### Units
`meters`

#### Minimum
`0`


#### Requires
`fillExtrusionHeight`

#### Expression

Parameters: `zoom, feature, feature-state`
___

### `fillExtrusionBaseTransition`

The transition affecting any changes to this layer’s fillExtrusionBase propery.

#### Type

`{ duration, delay }`

#### Units
`milliseconds`

#### Default Value
`{duration: 300, delay: 0}`


___

### `fillExtrusionVerticalGradient`

Whether to apply a vertical gradient to the sides of a fillExtrusion layer. If true, sides will be shaded slightly darker farther down.

#### Type
`boolean`
#### Default Value
`true`


#### Expression

Parameters: `zoom`

