---
# DO NOT MODIFY
# This file is auto-generated from src/components/CircleLayer.tsx
sidebar_label: CircleLayer
---

# `<CircleLayer />`

CircleLayer is a style layer that renders one or more filled circles on the map.

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |  `CircleLayerStyle`   |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`circleSortKey`</a><br/>
- <a href="#name-1">`visibility`</a><br/>
- <a href="#name-2">`circleRadius`</a><br/>
- <a href="#name-3">`circleColor`</a><br/>
- <a href="#name-4">`circleBlur`</a><br/>
- <a href="#name-5">`circleOpacity`</a><br/>
- <a href="#name-6">`circleTranslate`</a><br/>
- <a href="#name-7">`circleTranslateAnchor`</a><br/>
- <a href="#name-8">`circlePitchScale`</a><br/>
- <a href="#name-9">`circlePitchAlignment`</a><br/>
- <a href="#name-10">`circleStrokeWidth`</a><br/>
- <a href="#name-11">`circleStrokeColor`</a><br/>
- <a href="#name-12">`circleStrokeOpacity`</a><br/>

### `circleSortKey`

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

### `circleRadius`

Circle radius.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>5</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `circleRadiusTransition`

The transition affecting any changes to this layer’s circleRadius property.

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

### `circleColor`

The fill color of the circle.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `circleColorTransition`

The transition affecting any changes to this layer’s circleColor property.

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

### `circleBlur`

Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `circleBlurTransition`

The transition affecting any changes to this layer’s circleBlur property.

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

### `circleOpacity`

The opacity at which the circle will be drawn.

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

### `circleOpacityTransition`

The transition affecting any changes to this layer’s circleOpacity property.

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

### `circleTranslate`

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

### `circleTranslateTransition`

The transition affecting any changes to this layer’s circleTranslate property.

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

### `circleTranslateAnchor`

Controls the frame of reference for `circleTranslate`.

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
                    <code>map</code>: The circle is translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: The circle is translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>circleTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `circlePitchScale`

Controls the scaling behavior of the circle when the map is pitched.

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
                    <code>map</code>: Circles are scaled according to their apparent distance to the camera.
                </li>
                <li>
                    <code>viewport</code>: Circles are not scaled.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `circlePitchAlignment`

Orientation of circle when map is pitched.

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>viewport</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>map</code>: The circle is aligned to the plane of the map.
                </li>
                <li>
                    <code>viewport</code>: The circle is aligned to the plane of the viewport.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `circleStrokeWidth`

The width of the circle's stroke. Strokes are placed outside of the `circleRadius`.

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

### `circleStrokeWidthTransition`

The transition affecting any changes to this layer’s circleStrokeWidth property.

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

### `circleStrokeColor`

The stroke color of the circle.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `circleStrokeColorTransition`

The transition affecting any changes to this layer’s circleStrokeColor property.

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

### `circleStrokeOpacity`

The opacity of the circle's stroke.

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

### `circleStrokeOpacityTransition`

The transition affecting any changes to this layer’s circleStrokeOpacity property.

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
