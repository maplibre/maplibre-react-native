---
# DO NOT MODIFY
# This file is auto-generated from src/modules/static-map/StaticMapManager.ts
sidebar_label: StaticMapManager
---

# `StaticMapManager`

The StaticMapManager creates static images of a map.

## Methods

### `createImage($0)`

Creates a static image of a map using provided options.NOTE pitch, heading, zoom only works when centerCoordinate is set.

#### Arguments

| Name |           Type           | Required | Description |
| ---- | :----------------------: | :------: | ----------- |
| `$0` | `StaticMapCreateOptions` |  `Yes`   |             |

```ts
// Creates a static map with longitude/latitude and returns the URI to the temporary png file
const uri = await StaticMapManager.create({
  center: [-74.12641, 40.797968],
  zoom: 12,
  bearing: 20,
  pitch: 30,
  mapStyle: "https://demotiles.maplibre.org/style.json",
  width: 128,
  height: 64,
  output: "file",
});

// Creates a static map with bounds and returns as base64 png
const uri = await StaticMapManager.create({
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
