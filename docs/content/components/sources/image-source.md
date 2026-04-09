---
# DO NOT MODIFY
# This file is auto-generated from src/components/sources/image-source/ImageSource.tsx
sidebar_label: ImageSource
---

# ImageSource

ImageSource is a content source that is used for a georeferenced raster image
to be shown on the map. The georeferenced image scales and rotates as the
user zooms and rotates the map

## Props

### `id`

A string that uniquely identifies the source.

**Type:** `string`

**Required:** No

### `url`

An HTTP(S) URL, absolute file URL, or local file URL to the source image.
Animated GIFs are not supported.

**Type:** `string | number`

**Required:** Yes

### `coordinates`

The top left, top right, bottom right, and bottom left coordinates for the
image.

**Type:**

```ts
[
    topLeft: LngLat,
    topRight: LngLat,
    bottomRight: LngLat,
    bottomLeft: LngLat,
  ]
```

**Required:** Yes

### `children`

**Type:** `ReactNode`

**Required:** No

### `testID`

**Type:** `string`

**Required:** No
