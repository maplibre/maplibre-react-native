---
# DO NOT MODIFY
# This file is auto-generated from src/components/SymbolLayer.tsx
sidebar_label: SymbolLayer
---

# `<SymbolLayer />`

SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |  `SymbolLayerStyle`   |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`symbolPlacement`</a><br/>
- <a href="#name-1">`symbolSpacing`</a><br/>
- <a href="#name-2">`symbolAvoidEdges`</a><br/>
- <a href="#name-3">`symbolSortKey`</a><br/>
- <a href="#name-4">`symbolZOrder`</a><br/>
- <a href="#name-5">`iconAllowOverlap`</a><br/>
- <a href="#name-6">`iconIgnorePlacement`</a><br/>
- <a href="#name-7">`iconOptional`</a><br/>
- <a href="#name-8">`iconRotationAlignment`</a><br/>
- <a href="#name-9">`iconSize`</a><br/>
- <a href="#name-10">`iconTextFit`</a><br/>
- <a href="#name-11">`iconTextFitPadding`</a><br/>
- <a href="#name-12">`iconImage`</a><br/>
- <a href="#name-13">`iconRotate`</a><br/>
- <a href="#name-14">`iconPadding`</a><br/>
- <a href="#name-15">`iconKeepUpright`</a><br/>
- <a href="#name-16">`iconOffset`</a><br/>
- <a href="#name-17">`iconAnchor`</a><br/>
- <a href="#name-18">`iconPitchAlignment`</a><br/>
- <a href="#name-19">`textPitchAlignment`</a><br/>
- <a href="#name-20">`textRotationAlignment`</a><br/>
- <a href="#name-21">`textField`</a><br/>
- <a href="#name-22">`textFont`</a><br/>
- <a href="#name-23">`textSize`</a><br/>
- <a href="#name-24">`textMaxWidth`</a><br/>
- <a href="#name-25">`textLineHeight`</a><br/>
- <a href="#name-26">`textLetterSpacing`</a><br/>
- <a href="#name-27">`textJustify`</a><br/>
- <a href="#name-28">`textRadialOffset`</a><br/>
- <a href="#name-29">`textVariableAnchor`</a><br/>
- <a href="#name-30">`textAnchor`</a><br/>
- <a href="#name-31">`textMaxAngle`</a><br/>
- <a href="#name-32">`textWritingMode`</a><br/>
- <a href="#name-33">`textRotate`</a><br/>
- <a href="#name-34">`textPadding`</a><br/>
- <a href="#name-35">`textKeepUpright`</a><br/>
- <a href="#name-36">`textTransform`</a><br/>
- <a href="#name-37">`textOffset`</a><br/>
- <a href="#name-38">`textAllowOverlap`</a><br/>
- <a href="#name-39">`textIgnorePlacement`</a><br/>
- <a href="#name-40">`textOptional`</a><br/>
- <a href="#name-41">`visibility`</a><br/>
- <a href="#name-42">`iconOpacity`</a><br/>
- <a href="#name-43">`iconColor`</a><br/>
- <a href="#name-44">`iconHaloColor`</a><br/>
- <a href="#name-45">`iconHaloWidth`</a><br/>
- <a href="#name-46">`iconHaloBlur`</a><br/>
- <a href="#name-47">`iconTranslate`</a><br/>
- <a href="#name-48">`iconTranslateAnchor`</a><br/>
- <a href="#name-49">`textOpacity`</a><br/>
- <a href="#name-50">`textColor`</a><br/>
- <a href="#name-51">`textHaloColor`</a><br/>
- <a href="#name-52">`textHaloWidth`</a><br/>
- <a href="#name-53">`textHaloBlur`</a><br/>
- <a href="#name-54">`textTranslate`</a><br/>
- <a href="#name-55">`textTranslateAnchor`</a><br/>

### `symbolPlacement`

Label placement relative to its geometry.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>point</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>point</code>: The label is placed at the point where the geometry is located.
                </li>
                <li>
                    <code>line</code>: The label is placed along the line of the geometry. Can only be used on `LineString` and `Polygon` geometries.
                </li>
                <li>
                    <code>line-center</code>: The label is placed at the center of the line of the geometry. Can only be used on `LineString` and `Polygon` geometries. Note that a single feature in a vector tile may contain multiple line geometries.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `symbolSpacing`

Distance between two symbol anchors.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>250</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `symbolAvoidEdges`

If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer. When using a client that supports global collision detection, like MapLibre GL JS version 0.42.0 or greater, enabling this property is not needed to prevent clipped labels at tile boundaries.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `symbolSortKey`

Sorts features in ascending order based on this value. Features with lower sort keys are drawn and placed first. When `iconAllowOverlap` or `textAllowOverlap` is `false`, features with a lower sort key will have priority during placement. When `iconAllowOverlap` or `textAllowOverlap` is set to `true`, features with a higher sort key will overlap over features with a lower sort key.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `symbolZOrder`

Determines whether overlapping symbols in the same layer are rendered in the order that they appear in the data source or by their yPosition relative to the viewport. To control the order and prioritization of symbols otherwise, use `symbolSortKey`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>auto</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>auto</code>: Sorts symbols by `symbol-sort-key` if set. Otherwise, sorts symbols by their y-position relative to the viewport if `icon-allow-overlap` or `text-allow-overlap` is set to `true` or `icon-ignore-placement` or `text-ignore-placement` is `false`.
                </li>
                <li>
                    <code>viewport-y</code>: Sorts symbols by their y-position relative to the viewport if `icon-allow-overlap` or `text-allow-overlap` is set to `true` or `icon-ignore-placement` or `text-ignore-placement` is `false`.
                </li>
                <li>
                    <code>source</code>: Sorts symbols by `symbol-sort-key` if set. Otherwise, no sorting is applied; symbols are rendered in the same order as the source data.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconAllowOverlap`

If true, the icon will be visible even if it collides with other previously drawn symbols.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Disabled By</dt>
        <dd><code>iconOverlap</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconIgnorePlacement`

If true, other symbols can be visible even if they collide with the icon.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconOptional`

If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage, textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconRotationAlignment`

In combination with `symbolPlacement`, determines the rotation behavior of icons.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>auto</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: When `symbol-placement` is set to `point`, aligns icons east-west. When `symbol-placement` is set to `line` or `line-center`, aligns icon x-axes with the line.
                </li>
                <li>
                    <code>viewport</code>: Produces icons whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.
                </li>
                <li>
                    <code>auto</code>: When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconSize`

Scales the original size of the icon by the provided factor. The new pixel size of the image will be the original pixel size multiplied by `iconSize`. 1 is the original size; 3 triples the size of the image.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Units</dt>
        <dd><code>factor of the original icon size</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconTextFit`

Scales the icon to fit around the associated text.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>none</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>none</code>: The icon is displayed at its intrinsic aspect ratio.
                </li>
                <li>
                    <code>width</code>: The icon is scaled in the x-dimension to fit the width of the text.
                </li>
                <li>
                    <code>height</code>: The icon is scaled in the y-dimension to fit the height of the text.
                </li>
                <li>
                    <code>both</code>: The icon is scaled in both x- and y-dimensions.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>iconImage, textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconTextFitPadding`

Size of the additional area added to dimensions determined by `iconTextFit`, in clockwise order: top, right, bottom, left.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0,0,0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage, textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconImage`

Name of image in sprite to use for drawing an image background.

<dl>
    <dt>Type</dt>
    <dd>
        <code>resolvedImage</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconRotate`

Rotates the icon clockwise.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>degrees</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconPadding`

Size of additional area round the icon bounding box used for detecting symbol collisions.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>2</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconKeepUpright`

If true, the icon may be flipped to prevent it from being rendered upsideDown.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconOffset`

Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up. Each component is multiplied by the value of `iconSize` to obtain the final offset in pixels. When combined with `iconRotate` the offset will be as if the rotated direction was up.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconAnchor`

Part of the icon placed closest to the anchor.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>center</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>center</code>: The center of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>left</code>: The left side of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>right</code>: The right side of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>top</code>: The top of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom</code>: The bottom of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>top-left</code>: The top left corner of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>top-right</code>: The top right corner of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom-left</code>: The bottom left corner of the icon is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom-right</code>: The bottom right corner of the icon is placed closest to the anchor.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `iconPitchAlignment`

Orientation of icon when map is pitched.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>auto</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: The icon is aligned to the plane of the map.
                </li>
                <li>
                    <code>viewport</code>: The icon is aligned to the plane of the viewport.
                </li>
                <li>
                    <code>auto</code>: Automatically matches the value of `icon-rotation-alignment`.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textPitchAlignment`

Orientation of text when map is pitched.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>auto</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: The text is aligned to the plane of the map.
                </li>
                <li>
                    <code>viewport</code>: The text is aligned to the plane of the viewport.
                </li>
                <li>
                    <code>auto</code>: Automatically matches the value of `text-rotation-alignment`.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textRotationAlignment`

In combination with `symbolPlacement`, determines the rotation behavior of the individual glyphs forming the text.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>auto</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: When `symbol-placement` is set to `point`, aligns text east-west. When `symbol-placement` is set to `line` or `line-center`, aligns text x-axes with the line.
                </li>
                <li>
                    <code>viewport</code>: Produces glyphs whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.
                </li>
                <li>
                    <code>viewport-glyph</code>: When `symbol-placement` is set to `point`, aligns text to the x-axis of the viewport. When `symbol-placement` is set to `line` or `line-center`, aligns glyphs to the x-axis of the viewport and places them along the line.
                </li>
                <li>
                    <code>auto</code>: When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textField`

Value to use for a text label. If a plain `string` is provided, it will be treated as a `formatted` with default/inherited formatting options.

<dl>
    <dt>Type</dt>
    <dd>
        <code>formatted</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code></code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textFont`

Font stack to use for displaying text.

<dl>
    <dt>Type</dt>
    <dd>
        <code>string[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>Open Sans Regular,Arial Unicode MS Regular</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textSize`

Font size.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>16</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textMaxWidth`

The maximum line width for text wrapping.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>10</code></dd>
        <dt>Units</dt>
        <dd><code>ems</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textLineHeight`

Text leading value for multiLine text.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1.2</code></dd>
        <dt>Units</dt>
        <dd><code>ems</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textLetterSpacing`

Text tracking amount.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>ems</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textJustify`

Text justification options.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>center</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>auto</code>: The text is aligned towards the anchor position.
                </li>
                <li>
                    <code>left</code>: The text is aligned to the left.
                </li>
                <li>
                    <code>center</code>: The text is centered.
                </li>
                <li>
                    <code>right</code>: The text is aligned to the right.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textRadialOffset`

Radial offset of text, in the direction of the symbol's anchor. Useful in combination with `textVariableAnchor`, which defaults to using the twoDimensional `textOffset` if present.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>ems</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textVariableAnchor`

To increase the chance of placing highPriority labels on the map, you can provide an array of `textAnchor` locations: the renderer will attempt to place the label at each location, in order, before moving onto the next label. Use `textJustify: auto` to choose justification based on anchor position. To apply an offset, use the `textRadialOffset` or the twoDimensional `textOffset`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum[]</code>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textAnchor`

Part of the text placed closest to the anchor.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>center</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>center</code>: The center of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>left</code>: The left side of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>right</code>: The right side of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>top</code>: The top of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom</code>: The bottom of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>top-left</code>: The top left corner of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>top-right</code>: The top right corner of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom-left</code>: The bottom left corner of the text is placed closest to the anchor.
                </li>
                <li>
                    <code>bottom-right</code>: The bottom right corner of the text is placed closest to the anchor.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Disabled By</dt>
        <dd><code>textVariableAnchor</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textMaxAngle`

Maximum angle change between adjacent characters.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>45</code></dd>
        <dt>Units</dt>
        <dd><code>degrees</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textWritingMode`

The property allows control over a symbol's orientation. Note that the property values act as a hint, so that a symbol whose language doesn’t support the provided orientation will be laid out in its natural orientation. Example: English point symbol will be rendered horizontally even if array value contains single 'vertical' enum value. The order of elements in an array define priority order for the placement of an orientation variant.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum[]</code>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textRotate`

Rotates the text clockwise.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>degrees</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textPadding`

Size of the additional area around the text bounding box used for detecting symbol collisions.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>2</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textKeepUpright`

If true, the text may be flipped vertically to prevent it from being rendered upsideDown.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>true</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textTransform`

Specifies how to capitalize text, similar to the CSS `textTransform` property.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>none</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>none</code>: The text is not altered.
                </li>
                <li>
                    <code>uppercase</code>: Forces all letters to be displayed in uppercase.
                </li>
                <li>
                    <code>lowercase</code>: Forces all letters to be displayed in lowercase.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textOffset`

Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up. If used with textVariableAnchor, input values will be taken as absolute values. Offsets along the x and yAxis will be applied automatically based on the anchor position.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0</code></dd>
        <dt>Units</dt>
        <dd><code>ems</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Disabled By</dt>
        <dd><code>textRadialOffset</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `textAllowOverlap`

If true, the text will be visible even if it collides with other previously drawn symbols.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Disabled By</dt>
        <dd><code>textOverlap</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textIgnorePlacement`

If true, other symbols can be visible even if they collide with the text.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textOptional`

If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>false</code></dd>
        <dt>Requires</dt>
        <dd><code>textField, iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `visibility`

Whether this layer is displayed.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>visible</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>visible</code>: The layer is shown.
                </li>
                <li>
                    <code>none</code>: The layer is not shown.
                </li>
        </ul>
    </dd>
</dl>

### `iconOpacity`

The opacity at which the icon will be drawn.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `iconOpacityTransition`

The transition affecting any changes to this layer’s iconOpacity property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconColor`

The color of the icon. This can only be used with SDF icons.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `iconColorTransition`

The transition affecting any changes to this layer’s iconColor property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconHaloColor`

The color of the icon's halo. Icon halos can only be used with SDF icons.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>rgba(0, 0, 0, 0)</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `iconHaloColorTransition`

The transition affecting any changes to this layer’s iconHaloColor property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconHaloWidth`

Distance of halo to the icon outline.

The unit is in pixels only for SDF sprites that were created with a blur radius of 8, multiplied by the display density. I.e., the radius needs to be 16 for `@2x` sprites, etc.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `iconHaloWidthTransition`

The transition affecting any changes to this layer’s iconHaloWidth property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconHaloBlur`

Fade out the halo towards the outside.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `iconHaloBlurTransition`

The transition affecting any changes to this layer’s iconHaloBlur property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconTranslate`

Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Requires</dt>
        <dd><code>iconImage</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `iconTranslateTransition`

The transition affecting any changes to this layer’s iconTranslate property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `iconTranslateAnchor`

Controls the frame of reference for `iconTranslate`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>map</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: Icons are translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: Icons are translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>iconImage, iconTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textOpacity`

The opacity at which the text will be drawn.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `textOpacityTransition`

The transition affecting any changes to this layer’s textOpacity property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textColor`

The color with which the text will be drawn.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `textColorTransition`

The transition affecting any changes to this layer’s textColor property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textHaloColor`

The color of the text's halo, which helps it stand out from backgrounds.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>rgba(0, 0, 0, 0)</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `textHaloColorTransition`

The transition affecting any changes to this layer’s textHaloColor property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textHaloWidth`

Distance of halo to the font outline. Max text halo width is 1/4 of the fontSize.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `textHaloWidthTransition`

The transition affecting any changes to this layer’s textHaloWidth property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textHaloBlur`

The halo's fadeout distance towards the outside.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `textHaloBlurTransition`

The transition affecting any changes to this layer’s textHaloBlur property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textTranslate`

Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Requires</dt>
        <dd><code>textField</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `textTranslateTransition`

The transition affecting any changes to this layer’s textTranslate property.

<dl>
  <dt>Type</dt>
  <dd>
    <code>&lcub; duration, delay &rcub;</code>
  </dd>

  <dt>Units</dt>
  <dd>
    <code>milliseconds</code>
  </dd>

  <dt>Default Value</dt>
  <dd>
    <code>&lcub; duration: 300, delay: 0 &rcub;</code>
  </dd>
</dl>

### `textTranslateAnchor`

Controls the frame of reference for `textTranslate`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>map</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: The text is translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: The text is translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>textField, textTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>
