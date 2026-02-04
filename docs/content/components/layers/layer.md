---
# DO NOT MODIFY
# This file is auto-generated from src/components/Layer.tsx
sidebar_label: Layer
---

# `<Layer />`

Layer is a style layer that renders geospatial data on the map.<br/><br/>This is a unified, type-safe layer component that supports all layer types.<br/>Use the style-spec compliant `paint` and `layout` props with kebab-case keys.<br/><br/>@example<br/>`tsx<br/>// Style spec compliant (recommended)<br/><Layer<br/>  type="fill"<br/>  id="parks"<br/>  source="parks-source"<br/>  paint={{ "fill-color": "green", "fill-opacity": 0.5 }}<br/>  layout={{ visibility: "visible" }}<br/>/><br/><br/>// With expressions<br/><Layer<br/>  type="fill"<br/>  id="parks"<br/>  source="parks-source"<br/>  paint={{<br/>    "fill-color": ["interpolate", ["linear"], ["get", "elevation"], 0, "blue", 100, "red"],<br/>  }}<br/>/><br/><br/>// Deprecated style prop (still works but will be removed in v12)<br/><Layer<br/>  type="fill"<br/>  id="parks"<br/>  source="parks-source"<br/>  style={{ fillColor: "green", fillOpacity: 0.5 }}<br/>/><br/>`

## Props

| Prop         |      Type       | Default | Required | Description                                                                 |
| ------------ | :-------------: | :-----: | :------: | --------------------------------------------------------------------------- |
| `id`         |    `string`     | `none`  | `false`  | A string that uniquely identifies the layer in the style.                   |
| `style`      | `AllLayerStyle` | `none`  | `false`  | @deprecated Use `paint` and `layout` props instead. Will be removed in v12. |
| `beforeId`   |    `string`     | `none`  | `false`  | The layer will appear under this layer ID.                                  |
| `afterId`    |    `string`     | `none`  | `false`  | The layer will appear above this layer ID.                                  |
| `layerIndex` |    `number`     | `none`  | `false`  | Inserts the layer at the specified index.                                   |
