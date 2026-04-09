---
# DO NOT MODIFY
# This file is auto-generated from src/components/images/Images.tsx
sidebar_label: Images
sidebar_position: 5
---

# Images

Images defines the images used in Symbol layers.
Use this component to add images to the map style that can be referenced by
symbol layers using the `iconImage` property.

## Props

### `images`

Specifies the images in key-value pairs required for the style. Keys are
names used in style expressions (e.g., "customIcon").
Values provide a `source`, which can be one of the following types:

- A string URL: `"https://example.com/icon.png"`
- A native asset name: `"pin"` (from xcassets on iOS or drawable on Android)
- A require/import: `require('./icon.png')`
  If your image supports SDF, you can set the `sdf` property to true:
  `{ source: require('./sdf-icon.png'), sdf: true }`

**Type:** `{ [key: string]: ImageEntry }`

**Required:** Yes

### `onImageMissing`

Called when a layer references an image that is not present in the style. You
can use this to dynamically add images on demand.

**Type:** `(event: NativeSyntheticEvent<{ image: string }>) => void`

**Required:** No

### `testID`

**Type:** `string`

**Required:** No

## Types

### `ImageSourceWithSdf`

An image source with optional SDF (Signed Distance Field) rendering mode.

```ts
type ImageSourceWithSdf = {
  source: ImageSourcePropType;
  sdf?: boolean;
};
```

### `ImageEntry`

A map image entry: a URL string, a native asset require, or an
`ImageSourceWithSdf` object.

```ts
type ImageEntry = string | ImageRequireSource | ImageSourceWithSdf;
```
