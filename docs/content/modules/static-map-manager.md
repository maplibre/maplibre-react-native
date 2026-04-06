---
# DO NOT MODIFY
# This file is auto-generated from src/modules/static-map/StaticMapManager.ts
sidebar_label: StaticMapManager
---

# StaticMapManager

The StaticMapManager creates static images of a map.

## Methods

### `createImage(options)`

Creates a static image of a map. Images are always in PNG format.

#### `options`

**Type:** `StaticMapCreateOptions` | **Required:** Yes

**Returns:** `Promise<string>`

**Create static map with center, returning the URI to the temporary PNG file**

```ts
const uri = await StaticMapManager.createImage({
  center: [-74.12641, 40.797968],
  zoom: 12,
  bearing: 20,
  pitch: 30,
  mapStyle: "https://demotiles.maplibre.org/style.json",
  width: 128,
  height: 64,
  output: "file",
});
```

**Create a static map with bounds, returning a base64 encoded PNG**

```ts
const uri = await StaticMapManager.createImage({
  bounds: [
    [-74.12641, 40.797968],
    [-74.143727, 40.772177],
  ],
  mapStyle: "https://demotiles.maplibre.org/style.json",
  width: 128,
  height: 64,
  output: "base64",
});
```
