---
# DO NOT MODIFY
# This file is auto-generated from src/components/layer/Layer.tsx
sidebar_label: Layer
sidebar_position: 4
---

# Layer

Layer is a style layer that renders geospatial data on the map.
This is a unified, type-safe layer component that supports all layer types.

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

```ts
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
/>;

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
