---
# DO NOT MODIFY
# This file is auto-generated from src/components/LineLayer.tsx
sidebar_label: LineLayer
---

# `<LineLayer />`

LineLayer is a style layer that renders one or more stroked polylines on the map.

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |   `LineLayerStyle`    |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`lineCap`</a><br/>
- <a href="#name-1">`lineJoin`</a><br/>
- <a href="#name-2">`lineMiterLimit`</a><br/>
- <a href="#name-3">`lineRoundLimit`</a><br/>
- <a href="#name-4">`lineSortKey`</a><br/>
- <a href="#name-5">`visibility`</a><br/>
- <a href="#name-6">`lineOpacity`</a><br/>
- <a href="#name-7">`lineColor`</a><br/>
- <a href="#name-8">`lineTranslate`</a><br/>
- <a href="#name-9">`lineTranslateAnchor`</a><br/>
- <a href="#name-10">`lineWidth`</a><br/>
- <a href="#name-11">`lineGapWidth`</a><br/>
- <a href="#name-12">`lineOffset`</a><br/>
- <a href="#name-13">`lineBlur`</a><br/>
- <a href="#name-14">`lineDasharray`</a><br/>
- <a href="#name-15">`linePattern`</a><br/>
- <a href="#name-16">`lineGradient`</a><br/>

### `lineCap`

The display of line endings.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>butt</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>butt</code>: A cap with a squared-off end which is drawn to the exact endpoint of the line.
                </li>
                <li>
                    <code>round</code>: A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.
                </li>
                <li>
                    <code>square</code>: A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineJoin`

The display of lines when joining.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>miter</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>bevel</code>: A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.
                </li>
                <li>
                    <code>round</code>: A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.
                </li>
                <li>
                    <code>miter</code>: A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet.
                </li>
        </ul>
    </dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `lineMiterLimit`

Used to automatically convert miter joins to bevel joins for sharp angles.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>2</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineRoundLimit`

Used to automatically convert round joins to miter joins for shallow angles.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1.05</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineSortKey`

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
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

### `lineOpacity`

The opacity at which the line will be drawn.

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
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineOpacityTransition`

The transition affecting any changes to this layer’s lineOpacity property.

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

### `lineColor`

The color with which the line will be drawn.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Disabled By</dt>
        <dd><code>linePattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineColorTransition`

The transition affecting any changes to this layer’s lineColor property.

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

### `lineTranslate`

The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0,0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineTranslateTransition`

The transition affecting any changes to this layer’s lineTranslate property.

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

### `lineTranslateAnchor`

Controls the frame of reference for `lineTranslate`.

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
                    <code>map</code>: The line is translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: The line is translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>lineTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineWidth`

Stroke thickness.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Supported Style Functions</dt>
        <dd><code>camera</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineWidthTransition`

The transition affecting any changes to this layer’s lineWidth property.

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

### `lineGapWidth`

Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.

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
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineGapWidthTransition`

The transition affecting any changes to this layer’s lineGapWidth property.

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

### `lineOffset`

The line's offset. For linear features, a positive value offsets the line to the right, relative to the direction of the line, and a negative value to the left. For polygon features, a positive value results in an inset, and a negative value results in an outset.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineOffsetTransition`

The transition affecting any changes to this layer’s lineOffset property.

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

### `lineBlur`

Blur applied to the line, in pixels.

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
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `lineBlurTransition`

The transition affecting any changes to this layer’s lineBlur property.

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

### `lineDasharray`

Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width. Note that GeoJSON sources with `lineMetrics: true` specified won't render dashed lines to the expected scale. Also note that zoomDependent expressions will be evaluated only at integer zoom levels.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Units</dt>
        <dd><code>line widths</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Disabled By</dt>
        <dd><code>linePattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `lineDasharrayTransition`

The transition affecting any changes to this layer’s lineDasharray property.

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

### `linePattern`

Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

<dl>
    <dt>Type</dt>
    <dd>
        <code>resolvedImage</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `linePatternTransition`

The transition affecting any changes to this layer’s linePattern property.

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

### `lineGradient`

Defines a gradient with which to color a line feature. Can only be used with GeoJSON sources that specify `"lineMetrics": true`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Disabled By</dt>
        <dd><code>lineDasharray, linePattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>line-progress</code></dd>
</dl>
