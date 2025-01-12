---
# DO NOT MODIFY
# This file is auto-generated from src/components/FillExtrusionLayer.tsx
sidebar_label: FillExtrusionLayer
---

# `<FillExtrusionLayer />`

FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.

## Props

| Prop       |           Type            |                 Default                  | Required | Description                   |
| ---------- | :-----------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    | `FillExtrusionLayerStyle` |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` |   `FIX ME UNKNOWN TYPE`   | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`visibility`</a><br/>
- <a href="#name-1">`fillExtrusionOpacity`</a><br/>
- <a href="#name-2">`fillExtrusionColor`</a><br/>
- <a href="#name-3">`fillExtrusionTranslate`</a><br/>
- <a href="#name-4">`fillExtrusionTranslateAnchor`</a><br/>
- <a href="#name-5">`fillExtrusionPattern`</a><br/>
- <a href="#name-6">`fillExtrusionHeight`</a><br/>
- <a href="#name-7">`fillExtrusionBase`</a><br/>
- <a href="#name-8">`fillExtrusionVerticalGradient`</a><br/>

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

### `fillExtrusionOpacity`

The opacity of the entire fill extrusion layer. This is rendered on a perLayer, not perFeature, basis, and dataDriven styling is not available.

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
        <dd><code>zoom</code></dd>
</dl>

### `fillExtrusionOpacityTransition`

The transition affecting any changes to this layer’s fillExtrusionOpacity property.

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

### `fillExtrusionColor`

The base color of the extruded fill. The extrusion's surfaces will be shaded differently based on this color in combination with the root `light` settings. If this color is specified as `rgba` with an alpha component, the alpha component will be ignored; use `fillExtrusionOpacity` to set layer opacity.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Disabled By</dt>
        <dd><code>fillExtrusionPattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `fillExtrusionColorTransition`

The transition affecting any changes to this layer’s fillExtrusionColor property.

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

### `fillExtrusionTranslate`

The geometry's offset. Values are [x, y] where negatives indicate left and up (on the flat plane), respectively.

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

### `fillExtrusionTranslateTransition`

The transition affecting any changes to this layer’s fillExtrusionTranslate property.

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

### `fillExtrusionTranslateAnchor`

Controls the frame of reference for `fillExtrusionTranslate`.

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
                    <code>map</code>: The fill extrusion is translated relative to the map.
                </li>
                <li>
                    <code>viewport</code>: The fill extrusion is translated relative to the viewport.
                </li>
        </ul>
    </dd>
        <dt>Requires</dt>
        <dd><code>fillExtrusionTranslate</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `fillExtrusionPattern`

Name of image in sprite to use for drawing images on extruded fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

<dl>
    <dt>Type</dt>
    <dd>
        <code>resolvedImage</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature</code></dd>
</dl>

### `fillExtrusionPatternTransition`

The transition affecting any changes to this layer’s fillExtrusionPattern property.

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

### `fillExtrusionHeight`

The height with which to extrude this layer.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>meters</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `fillExtrusionHeightTransition`

The transition affecting any changes to this layer’s fillExtrusionHeight property.

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

### `fillExtrusionBase`

The height with which to extrude the base of this layer. Must be less than or equal to `fillExtrusionHeight`.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>meters</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Requires</dt>
        <dd><code>fillExtrusionHeight</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `fillExtrusionBaseTransition`

The transition affecting any changes to this layer’s fillExtrusionBase property.

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

### `fillExtrusionVerticalGradient`

Whether to apply a vertical gradient to the sides of a fillExtrusion layer. If true, sides will be shaded slightly darker farther down.

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
