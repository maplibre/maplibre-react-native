---
# DO NOT MODIFY
# This file is auto-generated from src/modules/offline/OfflineManager.ts
sidebar_label: OfflineManager
---

# OfflineManager

OfflineManager implements a singleton (shared object) that manages offline
packs. All of this class's instance methods are asynchronous, reflecting the
fact that offline resources are stored in a database. The shared object
maintains a canonical collection of offline packs.

## Methods

### `createPack(options, progressListener, errorListener)`

Creates and registers an offline pack that downloads the resources needed to
use the given region offline.

#### `options`

Create options for offline pack that specifies zoom levels, style url, and
the region to download.

**Type:** `OfflinePackCreateOptions`

**Required:** Yes

#### `progressListener`

Callback that listens for status events while downloading the offline
resource.

**Type:** `OfflinePackProgressListener`

**Required:** Yes

#### `errorListener`

Callback that listens for status events while downloading the offline
resource.

**Type:** `OfflinePackErrorListener`

**Required:** Yes

**Returns:** `Promise<OfflinePack>` — The created offline pack with its generated ID.

```ts
const progressListener = (offlineRegion, status) =>
  console.log(offlineRegion, status);
const errorListener = (offlineRegion, error) =>
  console.log(offlineRegion, error);

const offlinePack = await OfflineManager.createPack(
  {
    mapStyle: "https://demotiles.maplibre.org/tiles/tiles.json",
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

Invalidates the specified offline pack. This method checks that the tiles in
the specified offline pack match those from the server. Local tiles that do
not match the latest version on the server are updated.
This is more efficient than deleting the offline pack and downloading it
again. If the data stored locally matches that on the server, new data will
not be downloaded.

#### `id`

ID of the OfflinePack.

**Type:** `string`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await OfflineManager.invalidatePack(pack.id);
```

### `deletePack(id)`

Unregisters the given OfflinePack and allows resources that are no longer
required by any remaining packs to be potentially freed.

#### `id`

ID of the OfflinePack.

**Type:** `string`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await OfflineManager.deletePack(pack.id);
```

### `invalidateAmbientCache()`

Forces a revalidation of the tiles in the ambient cache and downloads a fresh
version of the tiles from the tile server. This is the recommend method for
clearing the cache. This is the most efficient method because tiles in the
ambient cache are re-downloaded to remove outdated data from a device. It
does not erase resources from the ambient cache or delete the database, which
can be computationally expensive operations that may carry unintended side
effects.

**Returns:** `Promise<void>`

```ts
await OfflineManager.invalidateAmbientCache();
```

### `clearAmbientCache()`

Erases resources from the ambient cache. This method clears the cache and
decreases the amount of space that map resources take up on the device.

**Returns:** `Promise<void>`

```ts
await OfflineManager.clearAmbientCache();
```

### `setMaximumAmbientCacheSize(size)`

Sets the maximum size of the ambient cache in bytes. Disables the ambient
cache if set to 0. This method may be computationally expensive because it
will erase resources from the ambient cache if its size is decreased.

#### `size`

Size of ambient cache.

**Type:** `number`

**Required:** Yes

**Returns:** `Promise<void>`

**await OfflineManager.setMaximumAmbientCacheSize(5000000);**

### `resetDatabase()`

Deletes the existing database, which includes both the ambient cache and
offline packs, then reinitializes it.

**Returns:** `Promise<void>`

```ts
await OfflineManager.resetDatabase();
```

### `getPacks()`

Retrieves all the current offline packs that are stored in the database.

**Returns:** `Promise<OfflinePack[]>`

**const offlinePacks = await OfflineManager.getPacks();**

### `getPack(id)`

Retrieves an offline pack that is stored in the database by ID.

#### `id`

**Type:** `string`

**Required:** Yes

**Returns:** `Promise<OfflinePack>`

```ts
const offlinePack = await OfflineManager.getPack(offlinePack.id);
```

### `mergeOfflineRegions(path)`

Sideloads offline db

#### `path`

Path to offline tile db on file system.

**Type:** `string`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
await OfflineManager.mergeOfflineRegions(path);
```

### `setTileCountLimit(limit)`

Sets the maximum number of tiles that may be downloaded and stored on the
current device. Consult the Terms of Service for your map tile host before
changing this value.

#### `limit`

Map tile limit count.

**Type:** `number`

**Required:** Yes

```ts
OfflineManager.setTileCountLimit(1000);
```

### `setProgressEventThrottle(throttleValue)`

Sets the period at which download status events will be sent over the React
Native bridge. The default is 500ms.

#### `throttleValue`

Event throttle value in ms.

**Type:** `number`

**Required:** Yes

```ts
OfflineManager.setProgressEventThrottle(500);
```

### `addListener(id, progressListener, errorListener)`

Subscribe to download status/error events for the requested offline pack.
Note that createPack calls this internally if listeners are provided.

#### `id`

ID of the offline pack.

**Type:** `string`

**Required:** Yes

#### `progressListener`

Callback that listens for status events while downloading the offline
resource.

**Type:** `OfflinePackProgressListener`

**Required:** Yes

#### `errorListener`

Callback that listens for status events while downloading the offline
resource.

**Type:** `OfflinePackErrorListener`

**Required:** Yes

**Returns:** `Promise<void>`

```ts
const progressListener = (offlinePack, status) =>
  console.log(offlinePack, status);
const errorListener = (offlinePack, error) => console.log(offlinePack, error);
OfflineManager.addListener(pack.id, progressListener, errorListener);
```

### `removeListener(packId)`

Unsubscribes any listeners associated with the offline pack. Should be called
when the component unmounts.

#### `packId`

ID of the offline pack.

**Type:** `string`

**Required:** Yes

```ts
useEffect(() => {
  return () => {
    OfflineManager.removeListener(pack.id);
  };
}, []);
```

## Types

### `OfflinePackDownloadState`

Represents the offline pack download state

```ts
type OfflinePackDownloadState = "inactive" | "active" | "complete";
```
