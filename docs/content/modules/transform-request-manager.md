---
# DO NOT MODIFY
# This file is auto-generated from src/modules/transform-request/TransformRequestManager.ts
sidebar_label: TransformRequestManager
---

# `TransformRequestManager`

TransformRequestManager provides methods for managing HTTP requests made by MapLibre.<br/>This includes adding custom headers to tile requests and controlling transform-request connectivity.

## Methods

### `addUrlTransform(options)`

Adds or updates a URL transform identified by .Transforms execute as a pipeline in insertion order — transform N+1 receives the URL<br/>already modified by transform N. Re-adding an existing updates the transform<br/>, preserving its position in the pipeline. This makes it safe to<br/>refresh tokens or swap domains without disrupting the order of other transforms.URL transforms are applied before and<br/>.

#### Arguments

| Name      |         Type          | Required | Description                                                                                                            |
| --------- | :-------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------- |
| `options` | `UrlTransformOptions` |  `Yes`   | The transform. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

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

### `addUrlSearchParam(options)`

Adds or updates a URL query parameter identified by that will be appended to all<br/>matching map resource requests. Re-adding an existing updates the param in-place.This is useful for adding authentication tokens (like Mapbox access_token) to tile,<br/>sprite, and glyph requests.

#### Arguments

| Name      |          Type           | Required | Description                                                                                                          |
| --------- | :---------------------: | :------: | -------------------------------------------------------------------------------------------------------------------- |
| `options` | `UrlSearchParamOptions` |  `Yes`   | The options. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

```ts
// Add access_token to all Mapbox API requests
TransformRequestManager.addUrlSearchParam({
  name: "access_token",
  value: "pk.your-mapbox-token",
  match: /api\.mapbox\.com/,
});

// Add api_key to all requests (no match = applies to all)
TransformRequestManager.addUrlSearchParam({
  name: "api_key",
  value: "your-api-key",
});
```

### `removeUrlSearchParam(id)`

Removes a previously added URL query parameter by its .<br/>No-op if the id is not registered.

#### Arguments

| Name |   Type   | Required | Description                              |
| ---- | :------: | :------: | ---------------------------------------- |
| `id` | `string` |  `Yes`   | The identifier passed to/returned from . |

### `addHeader(options)`

Adds or updates a custom HTTP header identified by that will be sent with all<br/>matching map resource requests. Re-adding an existing updates the header in-place.

#### Arguments

| Name      |      Type       | Required | Description                                                                                                          |
| --------- | :-------------: | :------: | -------------------------------------------------------------------------------------------------------------------- |
| `options` | `HeaderOptions` |  `Yes`   | The options. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

```ts
// Add header to all requests
TransformRequestManager.addHeader({
  name: "Authorization",
  value: "Bearer token123",
});

// Add header only to requests matching a pattern
TransformRequestManager.addHeader({
  name: "X-API-Key",
  value: "key123",
  match: /https:\/\/api\.example\.com\/tiles\//,
});
```

### `removeHeader(id)`

Removes a previously added custom HTTP header by its .<br/>No-op if the id is not registered.

#### Arguments

| Name |   Type   | Required | Description                              |
| ---- | :------: | :------: | ---------------------------------------- |
| `id` | `string` |  `Yes`   | The identifier passed to/returned from . |
