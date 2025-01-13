---
# DO NOT MODIFY
# This file is auto-generated from src/components/FillLayer.tsx
sidebar_label: FillLayer
---

# `<FillLayer />`

FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |   `FillLayerStyle`    |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`fillSortKey`</a><br/>
- <a href="#name-1">`visibility`</a><br/>
- <a href="#name-2">`fillAntialias`</a><br/>
- <a href="#name-3">`fillOpacity`</a><br/>
- <a href="#name-4">`fillColor`</a><br/>
- <a href="#name-5">`fillOutlineColor`</a><br/>
- <a href="#name-6">`fillTranslate`</a><br/>
- <a href="#name-7">`fillTranslateAnchor`</a><br/>
- <a href="#name-8">`fillPattern`</a><br/>

### `fillSortKey`

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

### `fillAntialias`

Whether or not the fill should be antialiased.

<dl>
    <dt>Type</dt>
    <dd>
        <code>boolean</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>true</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `fillOpacity`

The opacity of the entire fill layer. In contrast to the `fillColor`, this value will also affect the 1px stroke around the fill, if the stroke is used.

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

### `fillOpacityTransition`

The transition affecting any changes to this layer’s fillOpacity property.

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

### `fillColor`

The color of the filled part of this layer. This color can be specified as `rgba` with an alpha component and the color's opacity will not affect the opacity of the 1px stroke, if it is used.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Disabled By</dt>
        <dd><code>fillPattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `fillColorTransition`

The transition affecting any changes to this layer’s fillColor property.

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

### `fillOutlineColor`

The outline color of the fill. Matches the value of `fillColor` if unspecified.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Disabled By</dt>
        <dd><code>fillPattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `fillOutlineColorTransition`

The transition affecting any changes to this layer’s fillOutlineColor property.

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

### `fillTranslate`

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

### `fillTranslateTransition`

The transition affecting any changes to this layer’s fillTranslate property.

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

### `fillTranslateAnchor`

Controls the frame of reference for `fillTranslate`.

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
                    <code>map</code>: The fill is translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: The fill is translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>fillTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `fillPattern`

Name of image in sprite to use for drawing image fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

<dl>
    <dt>Type</dt>
    <dd>
        <code>resolvedImage</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `fillPatternTransition`

The transition affecting any changes to this layer’s fillPattern property.

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
