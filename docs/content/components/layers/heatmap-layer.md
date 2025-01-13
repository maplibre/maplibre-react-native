---
# DO NOT MODIFY
# This file is auto-generated from src/components/HeatmapLayer.tsx
sidebar_label: HeatmapLayer
---

# `<HeatmapLayer />`

HeatmapLayer is a style layer that renders one or more filled circles on the map.

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |  `HeatmapLayerStyle`  |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#name">`visibility`</a><br/>
- <a href="#name-1">`heatmapRadius`</a><br/>
- <a href="#name-2">`heatmapWeight`</a><br/>
- <a href="#name-3">`heatmapIntensity`</a><br/>
- <a href="#name-4">`heatmapColor`</a><br/>
- <a href="#name-5">`heatmapOpacity`</a><br/>

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

### `heatmapRadius`

Radius of influence of one heatmap point in pixels. Increasing the value makes the heatmap smoother, but less detailed.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>30</code></dd>
        <dt>Units</dt>
        <dd><code>pixels</code></dd>
        <dt>Minimum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `heatmapRadiusTransition`

The transition affecting any changes to this layer’s heatmapRadius property.

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

### `heatmapWeight`

A measure of how much an individual point contributes to the heatmap. A value of 10 would be equivalent to having 10 points of weight 1 in the same spot. Especially useful when combined with clustering.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom, feature, feature-state</code></dd>
</dl>

### `heatmapIntensity`

Similar to `heatmapWeight` but controls the intensity of the heatmap globally. Primarily used for adjusting the heatmap based on zoom level.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>1</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `heatmapIntensityTransition`

The transition affecting any changes to this layer’s heatmapIntensity property.

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

### `heatmapColor`

Defines the color of each pixel based on its density value in a heatmap. Should be an expression that uses `["heatmapDensity"]` as input.

<dl>
    <dt>Type</dt>
    <dd>
        <code>color</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>interpolate,linear,heatmap-density,0,rgba(0, 0, 255, 0),0.1,royalblue,0.3,cyan,0.5,lime,0.7,yellow,1,red</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>heatmap-density</code></dd>
</dl>

### `heatmapOpacity`

The global opacity at which the heatmap layer will be drawn.

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

### `heatmapOpacityTransition`

The transition affecting any changes to this layer’s heatmapOpacity property.

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
