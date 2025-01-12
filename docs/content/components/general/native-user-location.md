---
# DO NOT MODIFY
# This file is auto-generated from src/components/NativeUserLocation.tsx
sidebar_label: NativeUserLocation
---

# `<NativeUserLocation />`

## Props

| Prop                              |               Type               | Default | Required | Description                                                                                                                                                                                                                                                               |
| --------------------------------- | :------------------------------: | :-----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `androidRenderMode`               | `"normal" \| "compass" \| "gps"` | `none`  | `false`  | Android render mode.<br/><br/> - normal: just a circle<br/> - compass: triangle with heading<br/> - gps: large arrow<br/><br/>@platform android                                                                                                                           |
| `iosShowsUserHeadingIndicator`    |            `boolean`             | `none`  | `false`  | iOS only. A Boolean value indicating whether the user location annotation may display a permanent heading indicator.<br/><br/>@platform ios                                                                                                                               |
| `androidPreferredFramesPerSecond` |             `number`             | `none`  | `false`  | Android only. Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX. |
