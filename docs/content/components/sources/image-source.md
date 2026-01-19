---
# DO NOT MODIFY
# This file is auto-generated from src/components/ImageSource.tsx
sidebar_label: ImageSource
---

# `<ImageSource />`

ImageSource is a content source that is used for a georeferenced raster image to be shown on the map.<br/>The georeferenced image scales and rotates as the user zooms and rotates the map

## Props

| Prop          |        Type        | Default | Required | Description                                                                                                    |
| ------------- | :----------------: | :-----: | :------: | -------------------------------------------------------------------------------------------------------------- |
| `id`          |      `string`      | `none`  | `false`  | A string that uniquely identifies the source.                                                                  |
| `url`         | `string \| number` | `none`  |  `true`  | An HTTP(S) URL, absolute file URL, or local file URL to the source image.<br/>Animated GIFs are not supported. |
| `coordinates` |      `tuple`       | `none`  |  `true`  | The top left, top right, bottom right, and bottom left coordinates for the image.                              |
| `children`    |    `ReactNode`     | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                          |
