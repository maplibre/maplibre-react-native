---
# DO NOT MODIFY
# This file is auto-generated from src/modules/offline/OfflineManager.ts
sidebar_label: OfflineManager
---

# `OfflineManager`

OfflineManager implements a singleton (shared object) that manages offline packs.<br/>All of this class's instance methods are asynchronous, reflecting the fact that offline resources are stored in a database.<br/>The shared object maintains a canonical collection of offline packs.

## Methods

### `createPack(options, progressListener, errorListener)`

Creates and registers an offline pack that downloads the resources needed to use the given region offline.

#### Arguments

| Name               |             Type              | Required | Description                                                                                        |
| ------------------ | :---------------------------: | :------: | -------------------------------------------------------------------------------------------------- |
| `options`          |  `OfflinePackCreateOptions`   |  `Yes`   | Create options for offline pack that specifies zoom levels, style url, and the region to download. |
| `progressListener` | `OfflinePackProgressListener` |  `Yes`   | Callback that listens for status events while downloading the offline resource.                    |
| `errorListener`    |  `OfflinePackErrorListener`   |  `Yes`   | Callback that listens for status events while downloading the offline resource.                    |

```ts
const progressListener = (offlineRegion, status) =>
  console.log(offlineRegion, status);
const errorListener = (offlineRegion, error) =>
  console.log(offlineRegion, error);

const offlinePack = await OfflineManager.createPack(
  {
    styleURL: "https://demotiles.maplibre.org/tiles/tiles.json",
    minZoom: 14,
    maxZoom: 20,
    bounds: [west, south, east, north],
    metadata: { customValue: "myValue" },
  },
  progressListener,
  errorListener,
);
```

### `invalidatePack(id)`

Invalidates the specified offline pack. This method checks that the tiles in the specified offline pack match those from the server. Local tiles that do not match the latest version on the server are updated.This is more efficient than deleting the offline pack and downloading it again. If the data stored locally matches that on the server, new data will not be downloaded.

#### Arguments

| Name |   Type   | Required | Description            |
| ---- | :------: | :------: | ---------------------- |
| `id` | `string` |  `Yes`   | ID of the OfflinePack. |

```ts
await OfflineManager.invalidatePack(pack.id);
```

### `deletePack(id)`

Unregisters the given OfflinePack and allows resources that are no longer required by any remaining packs to be potentially freed.

#### Arguments

| Name |   Type   | Required | Description            |
| ---- | :------: | :------: | ---------------------- |
| `id` | `string` |  `Yes`   | ID of the OfflinePack. |

```ts
await OfflineManager.deletePack(pack.id);
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

### `getPack(id)`

Retrieves an offline pack that is stored in the database by ID.

#### Arguments

| Name |   Type   | Required | Description |
| ---- | :------: | :------: | ----------- |
| `id` | `string` |  `Yes`   |             |

```ts
const offlinePack = await OfflineManager.getPack(offlinePack.id);
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
| `throttleValue` | `number` |  `Yes`   | Event throttle value in ms. |

```ts
OfflineManager.setProgressEventThrottle(500);
```

### `addListener(id, progressListener, errorListener)`

Subscribe to download status/error events for the requested offline pack.<br/>Note that createPack calls this internally if listeners are provided.

#### Arguments

| Name               |             Type              | Required | Description                                                                     |
| ------------------ | :---------------------------: | :------: | ------------------------------------------------------------------------------- |
| `id`               |           `string`            |  `Yes`   | ID of the offline pack.                                                         |
| `progressListener` | `OfflinePackProgressListener` |  `Yes`   | Callback that listens for status events while downloading the offline resource. |
| `errorListener`    |  `OfflinePackErrorListener`   |  `Yes`   | Callback that listens for status events while downloading the offline resource. |

```ts
const progressListener = (offlinePack, status) =>
  console.log(offlinePack, status);
const errorListener = (offlinePack, error) => console.log(offlinePack, error);
OfflineManager.addListener(pack.id, progressListener, errorListener);
```

### `removeListener(packId)`

Unsubscribes any listeners associated with the offline pack.<br/>Should be called when the component unmounts.

#### Arguments

| Name     |   Type   | Required | Description             |
| -------- | :------: | :------: | ----------------------- |
| `packId` | `string` |  `Yes`   | ID of the offline pack. |

```ts
useEffect(() => {
  return () => {
    OfflineManager.removeListener(pack.id);
  };
}, []);
```
