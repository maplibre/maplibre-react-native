---
# DO NOT MODIFY
# This file is auto-generated from src/components/UserLocation.tsx
sidebar_label: UserLocation
---

# `<UserLocation />`

## Props

| Prop                              |               Type               |  Default   | Required | Description                                                                                                                                                                                                                                                                                          |
| --------------------------------- | :------------------------------: | :--------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animated`                        |            `boolean`             |   `true`   | `false`  | Whether location icon is animated between updates                                                                                                                                                                                                                                                    |
| `renderMode`                      |      `"normal" \| "native"`      | `"normal"` | `false`  | Which render mode to use.<br/>Can either be `normal` or `native`                                                                                                                                                                                                                                     |
| `androidRenderMode`               | `"normal" \| "compass" \| "gps"` |   `none`   | `false`  | native/android only render mode<br/><br/> - normal: just a circle<br/> - compass: triangle with heading<br/> - gps: large arrow<br/><br/>@platform android                                                                                                                                           |
| `visible`                         |            `boolean`             |   `true`   | `false`  | Whether location icon is visible                                                                                                                                                                                                                                                                     |
| `showsUserHeadingIndicator`       |            `boolean`             |  `false`   | `false`  | Show or hide small arrow which indicates direction the device is pointing relative to north.                                                                                                                                                                                                         |
| `minDisplacement`                 |             `number`             |    `0`     | `false`  | Minimum amount of movement before GPS location is updated in meters                                                                                                                                                                                                                                  |
| `androidPreferredFramesPerSecond` |             `number`             |   `none`   | `false`  | Android only. Set max FPS at which location animators can output updates. Use this setting to limit animation rate of the location puck on higher zoom levels to decrease the stress on the device's CPU which can directly improve battery life, without sacrificing UX.<br/><br/>@platform android |
| `children`                        |           `ReactNode`            |   `none`   | `false`  | Custom location icon of type mapbox-gl-native components<br/><br/>NOTE: Forking maintainer does not understand the above comment.                                                                                                                                                                    |

## Methods

### `setLocationManager({<br/>  running,<br/>}: {<br/>  running: boolean;<br/>})`

Whether to start or stop listening to the LocationManager<br/><br/>Notice, that listening will start automatically when<br/>either `onUpdate` or `visible` are set

#### Arguments

| Name                                                      |         Type         | Required | Description |
| --------------------------------------------------------- | :------------------: | :------: | ----------- |
| `{<br/>  running,<br/>}: {<br/>  running: boolean;<br/>}` | `{running:boolean;}` |  `Yes`   | undefined   |

### `needsLocationManagerRunning()`

If LocationManager should be running
