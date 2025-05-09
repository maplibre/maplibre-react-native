---
# DO NOT MODIFY
# This file is auto-generated from src/components/Images.tsx
sidebar_label: Images
---

# `<Images />`

Images defines the images used in Symbol etc layers

## Props

| Prop                |    Type     | Default | Required | Description                                                                                                                                                                                                                                                 |
| ------------------- | :---------: | :-----: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `images`            |   `shape`   | `none`  | `false`  | Specifies the external images in key-value pairs required for the shape source.<br/>Keys are names - see iconImage expressions, values can be either urls-s objects<br/>with format `{uri: 'http://...'}` or `require('image.png')` or `import "image.png"` |
| `  [object Object]` |   `union`   | `none`  |  `true`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                       |
| `nativeAssetImages` |   `Array`   | `none`  | `false`  | If you have an asset under Image.xcassets on iOS and the drawables directory on android<br/>you can specify an array of string names with assets as the key `['pin']`.                                                                                      |
| `id`                |  `string`   | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                       |
| `children`          | `ReactNode` | `none`  | `false`  | FIX ME NO DESCRIPTION                                                                                                                                                                                                                                       |
## Example

```jsx
<MapboxGL.MapView ...>
....
  <MapboxGL.Images
    onImageMissing={(imageKey) => {
      console.log("Missing icon", imageKey);
    }}
    images={{
      imageOne: require("./myImage.png"),
      imageTwo: require("./myImage2.png"),
    }}
  />
  <MapboxGL.ShapeSource id={sourceId} shape={data}>
				<MapboxGL.SymbolLayer
					id={`points`}
					style={{
						iconImage: "imageOne",
            ....
					}}
				/>
  </MapboxGL.ShapeSource>
</MapboxGL.MapView>
```
