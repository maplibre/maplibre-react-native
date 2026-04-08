---
# DO NOT MODIFY
# This file is auto-generated from src/modules/transform-request/TransformRequestManager.ts
sidebar_label: TransformRequestManager
---

# TransformRequestManager

TransformRequestManager provides methods for managing HTTP requests made by
MapLibre.
Transformations are possible in three ways:

- Transforming the URL with search and replace
- Adding URL search params
- Adding HTTP headers
  Transforms are applied in this order. The `match` conditions are applied to
  possibly already transformed URLs.
  To gain insight into which transforms are applied set the log level to
  `"debug"` via :

```ts
LogManager.setLogLevel("debug");
```

## Methods

### `addUrlTransform(options)`

Adds or updates a URL transform identified by `id`.
Transforms execute in insertion order. Therefore `match` and `find` regexes
are matched against possibly already modified URL by previous transforms.
Re-adding an existing `id` updates the transform **in-place**, preserving its
position in the pipeline. This makes it safe to refresh tokens or swap
domains without disrupting the order of other transforms.
URL transforms are applied before `addUrlSearchParam` and `addHeader`.

#### `options`

The transform. Set to a stable string to enable
in-place updates; if omitted an id is auto-generated and returned.

**Type:** `UrlTransformOptions`

**Required:** Yes

**Returns:** `string` — The id of the transform (the value of `transform.id` when provided, otherwise the auto-generated one). Pass it to to remove it later.

**Upgrade all requests to HTTPS**

```ts
TransformRequestManager.addUrlTransform({
  id: "force-https",
  find: "^http://",
  replace: "https://",
});
```

**Redirect a specific domain through a proxy**

```ts
TransformRequestManager.addUrlTransform({
  id: "proxy",
  match: "tiles\\.example\\.com",
  find: "tiles\\.example\\.com",
  replace: "proxy.example.com",
});
```

**Inject an API key into the path using a capture group**

```ts
TransformRequestManager.addUrlTransform({
  id: "api-key",
  match: "api\\.example\\.com",
  find: "(https://api\\.example\\.com/)(.*)",
  replace: "$1mySecretKey/$2",
});
```

### `removeUrlTransform(id)`

Removes the URL transform with the given `id` . No-op if the id is not
registered.

#### `id`

The identifier passed to/returned from .

**Type:** `string`

**Required:** Yes

### `clearUrlTransforms()`

Removes all registered URL transforms

### `addUrlSearchParam(options)`

Adds or updates a URL query parameter identified by `id` that will be
appended to all matching map resource requests. Re-adding an existing `id`
updates the param in-place.

#### `options`

The options. Set to a stable string to enable
in-place updates; if omitted an id is auto-generated and returned.

**Type:** `UrlSearchParamOptions`

**Required:** Yes

**Returns:** `string` — The id of the options. Pass it to to remove it later.

**Add apiKey to for a specific domain**

```ts
TransformRequestManager.addUrlSearchParam({
  match: /tiles\.example\.com/,
  name: "apiKey",
  value: "your-api-key",
});
```

// Add apiKey to all requests (no match = applies to all)
TransformRequestManager.addUrlSearchParam( name: "apiKey", value: "your-api-key" );

### `removeUrlSearchParam(id)`

Removes a previously added URL query parameter by its `id`.

#### `id`

The identifier passed to/returned from .

**Type:** `string`

**Required:** Yes

### `addHeader(options)`

Adds or updates an HTTP header identified by `id` that will be sent with all
matching map resource requests. Re-adding an existing `id` updates the header
in-place.

#### `options`

The options. Set to a stable string to enable
in-place updates; if omitted an id is auto-generated and returned.

**Type:** `HeaderOptions`

**Required:** Yes

**Returns:** `string` — The id of the options. Pass it to to remove it later.

**Add header to all requests**

```
TransformRequestManager.addHeader({ name: "Authorization", value: "Bearer token123" });

```

**Add header only to requests matching a pattern**

```ts
TransformRequestManager.addHeader({
  name: "X-API-Key",
  value: "key123",
  match: /https:\/\/api\.example\.com\/tiles\//,
});
```

### `clearUrlSearchParams()`

Removes all registered URL search params.

### `removeHeader(id)`

Removes a previously added HTTP header by its `id`.

#### `id`

The identifier passed to/returned from .

**Type:** `string`

**Required:** Yes

### `clearHeaders()`

Removes all registered HTTP headers.

### `clear()`

Removes all registered URL transforms, URL search params and HTTP headers.

## Types

### `UrlTransformOptions`

A serializable transform for rewriting MapLibre request URLs.
Transforms are applied as a pipeline in the order they were added: transform
N+1 sees the URL _after_ transform N has possibly changed it.

```ts
interface UrlTransformOptions {
  find: RegExp | string;
  replace: string;
}
```

### `UrlSearchParamOptions`

A URL query parameter to append to matching map resource requests.

```ts
interface UrlSearchParamOptions {
  name: string;
  value: string;
}
```

### `HeaderOptions`

A HTTP header to send with matching map resource requests.

```ts
interface HeaderOptions {
  name: string;
  value: string;
}
```
