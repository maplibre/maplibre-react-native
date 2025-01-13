---
# DO NOT MODIFY
# This file is auto-generated from src/modules/offline/OfflineManager.ts
sidebar_label: OfflineManager
---

# `OfflineManager`

OfflineManager implements a singleton (shared object) that manages offline packs.<br/>All of this class’s instance methods are asynchronous, reflecting the fact that offline resources are stored in a database.<br/>The shared object maintains a canonical collection of offline packs.

## Methods

### `createPack(options, progressListener, errorListener)`

Creates and registers an offline pack that downloads the resources needed to use the given region offline.

#### Arguments

| Name               |            Type            | Required | Description                                                                                           |
| ------------------ | :------------------------: | :------: | ----------------------------------------------------------------------------------------------------- |
| `options`          | `OfflineCreatePackOptions` |  `Yes`   | Create options for a offline pack that specifices zoom levels, style url, and the region to download. |
| `progressListener` |     `ProgressListener`     |  `Yes`   | Callback that listens for status events while downloading the offline resource.                       |
| `errorListener`    |      `ErrorListener`       |  `Yes`   | Callback that listens for status events while downloading the offline resource.                       |

```ts
const progressListener = (offlineRegion, status) =>
  console.log(offlineRegion, status);
const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);

await OfflineManager.createPack(
  {
    name: "offlinePack",
    styleURL: "https://demotiles.maplibre.org/tiles/tiles.json",
    minZoom: 14,
    maxZoom: 20,
    bounds: [
      [neLng, neLat],
      [swLng, swLat],
    ],
  },
  progressListener,
  errorListener,
);
```

### `invalidatePack(name)`

Invalidates the specified offline pack. This method checks that the tiles in the specified offline pack match those from the server. Local tiles that do not match the latest version on the server are updated.This is more efficient than deleting the offline pack and downloading it again. If the data stored locally matches that on the server, new data will not be downloaded.

#### Arguments

| Name   |   Type   | Required | Description               |
| ------ | :------: | :------: | ------------------------- |
| `name` | `string` |  `Yes`   | Name of the offline pack. |

```ts
await OfflineManager.invalidatePack("packName");
```

### `deletePack(name)`

Unregisters the given offline pack and allows resources that are no longer required by any remaining packs to be potentially freed.

#### Arguments

| Name   |   Type   | Required | Description               |
| ------ | :------: | :------: | ------------------------- |
| `name` | `string` |  `Yes`   | Name of the offline pack. |

```ts
await OfflineManager.deletePack("packName");
```

### `invalidateAmbientCache()`

Forces a revalidation of the tiles in the ambient cache and downloads a fresh version of the tiles from the tile server.<br/>This is the recommend method for clearing the cache.<br/>This is the most efficient method because tiles in the ambient cache are re-downloaded to remove outdated data from a device.<br/>It does not erase resources from the ambient cache or delete the database, which can be computationally expensive operations that may carry unintended side effects.

```ts
await OfflineManager.invalidateAmbientCache();
```

### `clearAmbientCache()`

Erases resources from the ambient cache.<br/>This method clears the cache and decreases the amount of space that map resources take up on the device.

```ts
await OfflineManager.clearAmbientCache();
```

### `setMaximumAmbientCacheSize(size)`

Sets the maximum size of the ambient cache in bytes. Disables the ambient cache if set to 0.<br/>This method may be computationally expensive because it will erase resources from the ambient cache if its size is decreased.

#### Arguments

| Name   |   Type   | Required | Description            |
| ------ | :------: | :------: | ---------------------- |
| `size` | `number` |  `Yes`   | Size of ambient cache. |

```ts
await OfflineManager.setMaximumAmbientCacheSize(5000000);
```

### `resetDatabase()`

Deletes the existing database, which includes both the ambient cache and offline packs, then reinitializes it.

```ts
await OfflineManager.resetDatabase();
```

### `getPacks()`

Retrieves all the current offline packs that are stored in the database.

```ts
const offlinePacks = await OfflineManager.getPacks();
```

### `getPack(name)`

Retrieves an offline pack that is stored in the database by name.

#### Arguments

| Name   |   Type   | Required | Description               |
| ------ | :------: | :------: | ------------------------- |
| `name` | `string` |  `Yes`   | Name of the offline pack. |

```ts
const offlinePack = await OfflineManager.getPack();
```

### `mergeOfflineRegions(path)`

Sideloads offline db

#### Arguments

| Name   |   Type   | Required | Description                             |
| ------ | :------: | :------: | --------------------------------------- |
| `path` | `string` |  `Yes`   | Path to offline tile db on file system. |

```ts
await OfflineManager.mergeOfflineRegions(path);
```

### `setTileCountLimit(limit)`

Sets the maximum number of tiles that may be downloaded and stored on the current device.<br/>Consult the Terms of Service for your map tile host before changing this value.

#### Arguments

| Name    |   Type   | Required | Description           |
| ------- | :------: | :------: | --------------------- |
| `limit` | `number` |  `Yes`   | Map tile limit count. |

```ts
OfflineManager.setTileCountLimit(1000);
```

### `setProgressEventThrottle(throttleValue)`

Sets the period at which download status events will be sent over the React Native bridge.<br/>The default is 500ms.

#### Arguments

| Name            |   Type   | Required | Description                 |
| --------------- | :------: | :------: | --------------------------- |
| `throttleValue` | `number` |  `Yes`   | event throttle value in ms. |

```ts
OfflineManager.setProgressEventThrottle(500);
```

### `subscribe(packName, progressListener, errorListener)`

Subscribe to download status/error events for the requested offline pack.<br/>Note that createPack calls this internally if listeners are provided.

#### Arguments

| Name               |        Type        | Required | Description                                                                     |
| ------------------ | :----------------: | :------: | ------------------------------------------------------------------------------- |
| `packName`         |      `string`      |  `Yes`   | Name of the offline pack.                                                       |
| `progressListener` | `ProgressListener` |  `Yes`   | Callback that listens for status events while downloading the offline resource. |
| `errorListener`    |  `ErrorListener`   |  `Yes`   | Callback that listens for status events while downloading the offline resource. |

```ts
const progressListener = (offlinePack, status) =>
  console.log(offlinePack, status);
const errorListener = (offlinePack, err) => console.log(offlinePack, err);
OfflineManager.subscribe("packName", progressListener, errorListener);
```

### `unsubscribe(packName)`

Unsubscribes any listeners associated with the offline pack.<br/>It's a good idea to call this on componentWillUnmount.

#### Arguments

| Name       |   Type   | Required | Description               |
| ---------- | :------: | :------: | ------------------------- |
| `packName` | `string` |  `Yes`   | Name of the offline pack. |

```ts
OfflineManager.unsubscribe("packName");
```
