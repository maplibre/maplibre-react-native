---
# DO NOT MODIFY
# This file is auto-generated from src/modules/transform-request/TransformRequestManager.ts
sidebar_label: TransformRequestManager
---

# `TransformRequestManager`

TransformRequestManager provides methods for managing HTTP requests made by MapLibre.Transformations are possible in three ways:Transforms are applied in this order. The conditions are applied to<br/>possibly already transformed URLs.

## Methods

### `addUrlTransform(options)`

Adds or updates a URL transform identified by .Transforms execute in insertion order. Therefore and regexes<br/>are matched against possibly already modified URL by previous transforms.Re-adding an existing updates the transform<br/>, preserving its position in the pipeline. This makes it safe to<br/>refresh tokens or swap domains without disrupting the order of other transforms.URL transforms are applied before and .

#### Arguments

| Name      |         Type          | Required | Description                                                                                                            |
| --------- | :-------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------- |
| `options` | `UrlTransformOptions` |  `Yes`   | The transform. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

```ts
// Upgrade all requests to HTTPS
TransformRequestManager.addUrlTransform({
  id: "force-https",
  find: "^http://",
  replace: "https://",
});
```

```ts
// Redirect a specific domain through a proxy
TransformRequestManager.addUrlTransform({
  id: "proxy",
  match: "tiles\\.example\\.com",
  find: "tiles\\.example\\.com",
  replace: "proxy.example.com",
});
```

```ts
// Inject an API key into the path using a capture group
TransformRequestManager.addUrlTransform({
  id: "api-key",
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

Adds or updates a URL query parameter identified by that will be appended to all<br/>matching map resource requests. Re-adding an existing updates the param in-place.

#### Arguments

| Name      |          Type           | Required | Description                                                                                                          |
| --------- | :---------------------: | :------: | -------------------------------------------------------------------------------------------------------------------- |
| `options` | `UrlSearchParamOptions` |  `Yes`   | The options. Set to a stable string to<br/>enable in-place updates; if omitted an id is auto-generated and returned. |

```ts
// Add apiKey to for a specific domain
TransformRequestManager.addUrlSearchParam({
  match: /tiles\.example\.com/,
  name: "apiKey",
  value: "your-api-key",
});

// Add apiKey to all requests (no match = applies to all)
TransformRequestManager.addUrlSearchParam({
  name: "apiKey",
  value: "your-api-key",
});
```

### `removeUrlSearchParam(id)`

Removes a previously added URL query parameter by its .

#### Arguments

| Name |   Type   | Required | Description                              |
| ---- | :------: | :------: | ---------------------------------------- |
| `id` | `string` |  `Yes`   | The identifier passed to/returned from . |

### `addHeader(options)`

Adds or updates an HTTP header identified by that will be sent with all<br/>matching map resource requests. Re-adding an existing updates the header in-place.

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

### `clearUrlSearchParams()`

Removes all registered URL search params.

### `removeHeader(id)`

Removes a previously added HTTP header by its .

#### Arguments

| Name |   Type   | Required | Description                              |
| ---- | :------: | :------: | ---------------------------------------- |
| `id` | `string` |  `Yes`   | The identifier passed to/returned from . |

### `clearHeaders()`

Removes all registered HTTP headers.

### `clear()`

Removes all registered URL transforms, URL search params and HTTP headers.
