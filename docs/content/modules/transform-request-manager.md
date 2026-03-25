---
# DO NOT MODIFY
# This file is auto-generated from src/modules/transform-request/TransformRequestManager.ts
sidebar_label: TransformRequestManager
---

# `TransformRequestManager`

TransformRequestManager provides methods for managing HTTP requests made by MapLibre.<br/>This includes adding custom headers to tile requests and controlling transform-request connectivity.

## Methods

### `addUrlTransform(transform)`

Adds or updates a URL transform identified by .Transforms execute as a pipeline in insertion order — transform N+1 receives the URL<br/>already modified by transform N. Re-adding an existing updates the transform<br/>, preserving its position in the pipeline. This makes it safe to<br/>refresh tokens or swap domains without disrupting the order of other transforms.URL transforms are applied before and<br/>.

#### Arguments

| Name        |      Type      | Required | Description                                                                                                            |
| ----------- | :------------: | :------: | ---------------------------------------------------------------------------------------------------------------------- |
| `transform` | `UrlTransform` |  `Yes`   | The transform. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

```ts
// Upgrade all requests to HTTPS
TransformRequestManager.addUrlTransform("force-https", {
  find: "^http://",
  replace: "https://",
});
```

```ts
// Redirect a specific domain through a proxy
TransformRequestManager.addUrlTransform("proxy", {
  match: "tiles\\.example\\.com",
  find: "tiles\\.example\\.com",
  replace: "proxy.example.com",
});
```

```ts
// Inject an API key into the path using a capture group
TransformRequestManager.addUrlTransform("api-key", {
  match: "api\\.example\\.com",
  find: "(https://api\\.example\\.com/)(.*)",
  replace: "$1mySecretKey/$2",
});
```

### `removeUrlTransform(id)`

Removes the URL transform with the given .<br/>No-op if the id is not registered.

#### Arguments

| Name |   Type   | Required | Description                              |
| ---- | :------: | :------: | ---------------------------------------- |
| `id` | `string` |  `Yes`   | The identifier passed to/returned from . |

### `clearUrlTransforms()`

Removes all registered URL transforms

### `addUrlSearchParam(name, value, [match])`

Adds a URL query parameter that will be appended to all matching map resource requests.<br/>This is useful for adding authentication tokens (like Mapbox access_token) to tile,<br/>sprite, and glyph requests.

#### Arguments

| Name    |   Type   | Required | Description                                                                                                                                                                                      |
| ------- | :------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`  | `string` |  `Yes`   | The query parameter name (e.g., "access_token")                                                                                                                                                  |
| `value` | `string` |  `Yes`   | The query parameter value (e.g., your API token)                                                                                                                                                 |
| `match` |  `n/a`   |   `No`   | Optional regex pattern to match against request URLs. If provided, the<br/>parameter will only be added to requests whose URLs match this pattern.<br/>Can be a RegExp object or a regex string. |

```ts
// Add access_token to all Mapbox API requests
TransformRequestManager.addUrlSearchParam(
  "access_token",
  "pk.your-mapbox-token",
  /api\.mapbox\.com/,
);

// Add api_key to all requests (no pattern = matches all)
TransformRequestManager.addUrlSearchParam("api_key", "your-api-key");
```

### `removeUrlSearchParam(name)`

Removes a previously added URL query parameter.

#### Arguments

| Name   |   Type   | Required | Description                       |
| ------ | :------: | :------: | --------------------------------- |
| `name` | `string` |  `Yes`   | The query parameter key to remove |

````ts
```ts
TransformRequestManager.removeUrlSearchParam("access_token");
````

````


### `addHeader(name, value, [match])`

Adds a custom HTTP header that will be sent with all map tile requests.<br/>This is useful for adding authentication tokens or other custom headers<br/>required by your tile server.

#### Arguments
| Name | Type | Required | Description |
| ---- | :--: | :------: | ----------- |
| `name` | `string` | `Yes` | The name of the header (e.g., "Authorization") |
| `value` | `string` | `Yes` | The value of the header (e.g., "Bearer token123") |
| `match` | `n/a` | `No` | Optional regex pattern to match against transform-request URLs. If provided, the header will only be added to requests whose URLs match this pattern. Can be a RegExp object or a regex string. |



```ts
// Add header to all requests
TransformRequestManager.addHeader("Authorization", "Bearer token123");

// Add header only to requests matching a regex pattern (string)
TransformRequestManager.addHeader("X-API-Key", "key123", "https:\\/\\/api\\.example\\.com\\/tiles\\/");

// Add header only to requests matching a regex pattern (RegExp)
TransformRequestManager.addHeader("X-API-Key", "key123", /https:\/\/api\.example\.com\/tiles\//);
````

### `removeHeader(name)`

Removes a previously added custom HTTP header.

#### Arguments

| Name   |   Type   | Required | Description                      |
| ------ | :------: | :------: | -------------------------------- |
| `name` | `string` |  `Yes`   | The name of the header to remove |

````ts
```ts
TransformRequestManager.removeHeader("Authorization");
````

````


### `setConnected(connected)`

Android only: Sets the connectivity state of the map. When set to false, the map will<br/>not make any transform-request requests and will only use cached tiles. This is<br/>useful for implementing offline mode or reducing data usage.

#### Arguments
| Name | Type | Required | Description |
| ---- | :--: | :------: | ----------- |
| `connected` | `boolean` | `Yes` | Whether the map should be connected to the transform-request |



```ts
```ts
// Enable offline mode
TransformRequestManager.setConnected(false);

// Re-enable transform-request requests
TransformRequestManager.setConnected(true);
````

```



```
