---
# DO NOT MODIFY
# This file is auto-generated from src/components/RasterLayer.tsx
sidebar_label: RasterLayer
---

# `<RasterLayer />`

## Props

| Prop       |         Type          |                 Default                  | Required | Description                   |
| ---------- | :-------------------: | :--------------------------------------: | :------: | ----------------------------- |
| `style`    |  `RasterLayerStyle`   |                  `none`                  | `false`  | Customizable style attributes |
| `sourceID` | `FIX ME UNKNOWN TYPE` | `MLRNModule.StyleSource.DefaultSourceID` | `false`  | FIX ME NO DESCRIPTION         |

## Styles

- <a href="#visibility-6">`visibility`</a><br/>
- <a href="#rasteropacity">`rasterOpacity`</a><br/>
- <a href="#rasterhuerotate">`rasterHueRotate`</a><br/>
- <a href="#rasterbrightnessmin">`rasterBrightnessMin`</a><br/>
- <a href="#rasterbrightnessmax">`rasterBrightnessMax`</a><br/>
- <a href="#rastersaturation">`rasterSaturation`</a><br/>
- <a href="#rastercontrast">`rasterContrast`</a><br/>
- <a href="#rasterresampling">`rasterResampling`</a><br/>
- <a href="#rasterfadeduration">`rasterFadeDuration`</a><br/>

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

### `rasterOpacity`

The opacity at which the image will be drawn.

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

### `rasterOpacityTransition`

The transition affecting any changes to this layer’s rasterOpacity property.

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

### `rasterHueRotate`

Rotates hues around the color wheel.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Units</dt>
        <dd><code>degrees</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `rasterHueRotateTransition`

The transition affecting any changes to this layer’s rasterHueRotate property.

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

### `rasterBrightnessMin`

Increase or reduce the brightness of the image. The value is the minimum brightness.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `rasterBrightnessMinTransition`

The transition affecting any changes to this layer’s rasterBrightnessMin property.

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

### `rasterBrightnessMax`

Increase or reduce the brightness of the image. The value is the maximum brightness.

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

### `rasterBrightnessMaxTransition`

The transition affecting any changes to this layer’s rasterBrightnessMax property.

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

### `rasterSaturation`

Increase or reduce the saturation of the image.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Minimum</dt>
        <dd><code>-1</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `rasterSaturationTransition`

The transition affecting any changes to this layer’s rasterSaturation property.

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

### `rasterContrast`

Increase or reduce the contrast of the image.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>0</code></dd>
        <dt>Minimum</dt>
        <dd><code>-1</code></dd>
        <dt>Maximum</dt>
        <dd><code>1</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `rasterContrastTransition`

The transition affecting any changes to this layer’s rasterContrast property.

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

### `rasterResampling`

The resampling/interpolation method to use for overscaling, also known as texture magnification filter

<dl>
    <dt>Type</dt>
    <dd>
        <code>enum</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>linear</code></dd>
    <dt>Supported Values</dt>
    <dd>
        <ul>
                <li>
                    <code>linear</code>: (Bi)linear filtering interpolates pixel values using the weighted average of the four closest original source pixels creating a smooth but blurry look when overscaled
                </li>
                <li>
                    <code>nearest</code>: Nearest neighbor filtering interpolates pixel values using the nearest original source pixel creating a sharp but pixelated look when overscaled
                </li>
        </ul>
    </dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>

### `rasterFadeDuration`

Fade duration when a new tile is added, or when a video is started or its coordinates are updated.

<dl>
    <dt>Type</dt>
    <dd>
        <code>number</code>
    </dd>
        <dt>Default Value</dt>
        <dd><code>300</code></dd>
        <dt>Units</dt>
        <dd><code>milliseconds</code></dd>
        <dt>Minimum</dt>
        <dd><code>0</code></dd>
        <dt>Expression Parameters</dt>
        <dd><code>zoom</code></dd>
</dl>
