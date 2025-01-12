---
# DO NOT MODIFY
# This file is auto-generated from src/components/BackgroundLayer.tsx
sidebar_label: BackgroundLayer
---

# `<BackgroundLayer />`

## Props

| Prop       |          Type          |                 Default                  | Required | Description                   |
| ---------- | :--------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    | `BackgroundLayerStyle` |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE`  | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`visibility`</a><br/>
- <a href="#name-1">`backgroundColor`</a><br/>
- <a href="#name-2">`backgroundPattern`</a><br/>
- <a href="#name-3">`backgroundOpacity`</a><br/>

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

### `backgroundColor`

The color with which the background will be drawn.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>#000000</code></dd>
        <dt>Disabled By</dt>
        <dd><code>backgroundPattern</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `backgroundColorTransition`

The transition affecting any changes to this layer’s backgroundColor property.

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

### `backgroundPattern`

Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.

<dl>
    <dt>Type</dt>
    <dd>
        <code>resolvedImage</code>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `backgroundPatternTransition`

The transition affecting any changes to this layer’s backgroundPattern property.

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

### `backgroundOpacity`

The opacity at which the background will be drawn.

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

### `backgroundOpacityTransition`

The transition affecting any changes to this layer’s backgroundOpacity property.

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
