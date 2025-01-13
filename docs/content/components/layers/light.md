---
# DO NOT MODIFY
# This file is auto-generated from src/components/Light.tsx
sidebar_label: Light
---

# `<Light />`

Light represents the light source for extruded geometries

## Props

| Prop    |       Type        | Default | Required | Description                   |
| ------- | :---------------: | :-----: | :------: | ----------------------------- |
| `style` | `LightLayerStyle` | `none`  | `false`  | Customizable style attributes |

## Styles

- <a href="#name">`anchor`</a><br/>
- <a href="#name-1">`position`</a><br/>
- <a href="#name-2">`color`</a><br/>
- <a href="#name-3">`intensity`</a><br/>

### `anchor`

Whether extruded geometries are lit relative to the map or viewport.

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
                    <code>map</code>: The position of the light source is aligned to the rotation of the map.
                </li>
                <li>
                    <code>viewport</code>: The position of the light source is aligned to the rotation of the viewport.
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `position`

Position of the light source relative to lit (extruded) geometries, in [r radial coordinate, a azimuthal angle, p polar angle] where r indicates the distance from the center of the base of an object to its light, a indicates the position of the light relative to 0° (0° when `light.anchor` is set to `viewport` corresponds to the top of the viewport, or 0° when `light.anchor` is set to `map` corresponds to due north, and degrees proceed clockwise), and p indicates the height of the light (from 0°, directly above, to 180°, directly below).

<dl>
    <dt>Type</dt>
    <dd>
        <code>number[]</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1.15,210,30</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `positionTransition`

The transition affecting any changes to this layer’s position property.

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

### `color`

Color tint for lighting extruded geometries.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#ffffff</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `colorTransition`

The transition affecting any changes to this layer’s color property.

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

### `intensity`

Intensity of lighting (on a scale from 0 to 1). Higher numbers will present as more extreme contrast.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0.5</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `intensityTransition`

The transition affecting any changes to this layer’s intensity property.

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
