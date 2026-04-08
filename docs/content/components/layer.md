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

_Also accepts props from: `LegacyBaseLayerProps`_

## Props

### `source`

**Type:** `string`

**Required:** No

### `"source-layer"`

**Type:** `string`

**Required:** No

### `filter`

**Type:** `FilterSpecification`

**Required:** No
