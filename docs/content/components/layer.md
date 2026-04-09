---
# DO NOT MODIFY
# This file is auto-generated from src/components/layer/Layer.tsx
sidebar_label: Layer
sidebar_position: 4
---

# Layer

Layer is a style layer that renders geospatial data on the map.
Follow the [MapLibre Style
Spec](https://maplibre.org/maplibre-style-spec/layers/) for Layer
definitions.

**Basic Usage**

```tsx
<Layer
  type="fill"
  id="parks"
  source="parks-source"
  paint={{ "fill-color": "green", "fill-opacity": 0.5 }}
  layout={{ visibility: "visible" }}
/>
```

**Using Expressions**

```tsx
<Layer
  type="fill"
  id="parks"
  source="parks-source"
  paint={{
    "fill-color": [
      "interpolate",
      ["linear"],
      ["get", "elevation"],
      0,
      "blue",
      100,
      "red",
    ],
  }}
/>
```

## Props

### `source`

**Type:** `string`

**Required:** No

### `source-layer`

**Type:** `string`

**Required:** No

### `filter`

**Type:** `FilterSpecification`

**Required:** No

### `id`

A string that uniquely identifies the layer in the style.

**Type:** `string`

**Required:** No

### `minzoom`

The minimum zoom at which the layer gets parsed and appears.

**Type:** `number`

**Required:** No

### `maxzoom`

The maximum zoom at which the layer gets parsed and appears.

**Type:** `number`

**Required:** No

### `paint`

**Type:** `never`

**Required:** No

### `layout`

**Type:** `never`

**Required:** No

### `beforeId`

The layer will appear under this layer.

**Type:** `string`

**Required:** No

### `afterId`

The layer will appear above this layer.

**Type:** `string`

**Required:** No

### `layerIndex`

Inserts the layer at the specified index.

**Type:** `number`

**Required:** No

### `testID`

**Type:** `string`

**Required:** No
