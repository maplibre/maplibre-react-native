---
# DO NOT MODIFY
# This file is auto-generated from src/modules/network/NetworkManager.ts
sidebar_label: NetworkManager
---

# NetworkManager

NetworkManager provides methods for managing and controlling network
connectivity.

## Methods

### `setConnected(connected)`

Android only: Sets the connectivity state of the map. When set to false, the
map will not make any network requests and will only use cached tiles. This
is useful for implementing offline mode or reducing data usage.

#### `connected`

Whether the map should be connected to the network

**Type:** `boolean` | **Required:** Yes

```ts
// Enable offline mode
NetworkManager.setConnected(false);
// Re-enable network requests
NetworkManager.setConnected(true);
```
