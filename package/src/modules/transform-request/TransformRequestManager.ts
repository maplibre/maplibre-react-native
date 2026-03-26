import NativeNetworkModule from "./NativeTransformRequestModule";

export interface TransformOptions {
  /**
   * The id is used to identify a transform. Can be used to remove or update it.
   * When omitted it will be auto-generated.
   */
  id?: string;

  /**
   * Optional regex to be used as the condition, if the transform should be
   * applied. When omitted the transform will always be applied.
   *
   * Supports inline flags, e.g. `(?i)` for case-insensitive matching.
   */
  match?: RegExp | string;
}

/**
 * A serializable transform for rewriting MapLibre request URLs.
 *
 * Transforms are applied as a pipeline in the order they were added: transform N+1 sees
 * the URL *after* transform N has possibly changed it.
 */
export interface UrlTransformOptions extends TransformOptions {
  /**
   * Regex to find the portion of the URL to replace.
   * Supports capture groups that can be back-referenced in `replace` as `$1`, `$2`, …
   */
  find: RegExp | string;

  /**
   * Replacement string. Reference capture groups from `find` with `$1`, `$2`, …
   */
  replace: string;
}

/**
 * A URL query parameter to append to matching map resource requests.
 */
export interface UrlSearchParamOptions extends TransformOptions {
  /** The query parameter name (e.g., `"apiKey"`). */
  name: string;

  /** The query parameter value (e.g., your API key). */
  value: string;
}

/**
 * A custom HTTP header to send with matching map resource requests.
 */
export interface HeaderOptions extends TransformOptions {
  /** The header name (e.g., `"Authorization"`). */
  name: string;

  /** The header value (e.g., `"Bearer token123"`). */
  value: string;
}

/**
 * TransformRequestManager provides methods for managing HTTP requests made by MapLibre.
 * This includes adding custom headers to tile requests and controlling transform-request connectivity.
 */
class TransformRequestManager {
  /**
   * Adds or updates a URL transform identified by `id`.
   *
   * Transforms execute as a pipeline in insertion order — transform N+1 receives the URL
   * already modified by transform N. Re-adding an existing `id` updates the transform
   * **in-place**, preserving its position in the pipeline. This makes it safe to
   * refresh tokens or swap domains without disrupting the order of other transforms.
   *
   * URL transforms are applied before `addHeader` and
   * `addUrlSearchParam`.
   *
   * @example
   * // Upgrade all requests to HTTPS
   * TransformRequestManager.addUrlTransform("force-https", {
   *   find: "^http://",
   *   replace: "https://",
   * });
   *
   * @example
   * // Redirect a specific domain through a proxy
   * TransformRequestManager.addUrlTransform("proxy", {
   *   match: "tiles\\.example\\.com",
   *   find: "tiles\\.example\\.com",
   *   replace: "proxy.example.com",
   * });
   *
   * @example
   * // Inject an API key into the path using a capture group
   * TransformRequestManager.addUrlTransform("api-key", {
   *   match: "api\\.example\\.com",
   *   find: "(https://api\\.example\\.com/)(.*)",
   *   replace: "$1mySecretKey/$2",
   * });
   *
   * @param options The transform. Set {@link TransformOptions.id} to a stable string to
   *   enable in-place updates; if omitted an id is auto-generated and returned.
   *
   * @returns The id of the transform (the value of `transform.id` when provided, otherwise
   *   the auto-generated one). Pass it to {@link removeUrlTransform} to remove it later.
   */
  addUrlTransform(options: UrlTransformOptions): string {
    const id = options.id ?? this.getId();

    NativeNetworkModule.addUrlTransform(
      id,
      TransformRequestManager.toRegexString(options.match),
      TransformRequestManager.toRegexString(options.find) ?? "",
      options.replace,
    );

    return id;
  }

  /**
   * Removes the URL transform with the given `id`.
   * No-op if the id is not registered.
   *
   * @param id The identifier passed to/returned from {@link addUrlTransform}.
   */
  removeUrlTransform(id: string): void {
    NativeNetworkModule.removeUrlTransform(id);
  }

  /**
   * Removes all registered URL transforms
   */
  clearUrlTransforms(): void {
    NativeNetworkModule.clearUrlTransforms();
  }

  /**
   * Adds or updates a URL query parameter identified by `id` that will be appended to all
   * matching map resource requests. Re-adding an existing `id` updates the param in-place.
   *
   * This is useful for adding authentication tokens (like Mapbox access_token) to tile,
   * sprite, and glyph requests.
   *
   * @example
   * // Add access_token to all Mapbox API requests
   * TransformRequestManager.addUrlSearchParam({
   *   name: "access_token",
   *   value: "pk.your-mapbox-token",
   *   match: /api\.mapbox\.com/,
   * });
   *
   * // Add api_key to all requests (no match = applies to all)
   * TransformRequestManager.addUrlSearchParam({ name: "api_key", value: "your-api-key" });
   *
   * @param options The options. Set {@link TransformOptions.id} to a stable string to
   *   enable in-place updates; if omitted an id is auto-generated and returned.
   *
   * @returns The id of the options. Pass it to {@link removeUrlSearchParam} to remove it later.
   */
  addUrlSearchParam(options: UrlSearchParamOptions): string {
    const id = options.id ?? this.getId();

    NativeNetworkModule.addUrlSearchParam(
      id,
      TransformRequestManager.toRegexString(options.match),
      options.name,
      options.value,
    );

    return id;
  }

  /**
   * Removes a previously added URL query parameter by its `id`.
   * No-op if the id is not registered.
   *
   * @param id The identifier passed to/returned from {@link addUrlSearchParam}.
   */
  removeUrlSearchParam(id: string): void {
    NativeNetworkModule.removeUrlSearchParam(id);
  }

  /**
   * Adds or updates a custom HTTP header identified by `id` that will be sent with all
   * matching map resource requests. Re-adding an existing `id` updates the header in-place.
   *
   * @example
   * // Add header to all requests
   * TransformRequestManager.addHeader({ name: "Authorization", value: "Bearer token123" });
   *
   * // Add header only to requests matching a pattern
   * TransformRequestManager.addHeader({
   *   name: "X-API-Key",
   *   value: "key123",
   *   match: /https:\/\/api\.example\.com\/tiles\//,
   * });
   *
   * @param options The options. Set {@link TransformOptions.id} to a stable string to
   *   enable in-place updates; if omitted an id is auto-generated and returned.
   *
   * @returns The id of the options. Pass it to {@link removeHeader} to remove it later.
   */
  addHeader(options: HeaderOptions): string {
    const id = options.id ?? this.getId();

    NativeNetworkModule.addHeader(
      id,
      TransformRequestManager.toRegexString(options.match),
      options.name,
      options.value,
    );

    return id;
  }

  /**
   * Removes a previously added custom HTTP header by its `id`.
   * No-op if the id is not registered.
   *
   * @param id The identifier passed to/returned from {@link addHeader}.
   */
  removeHeader(id: string): void {
    NativeNetworkModule.removeHeader(id);
  }

  private lastId: number = -1;

  private getId() {
    this.lastId++;

    return "transform-request-" + this.lastId;
  }

  private static toRegexString(
    value: string | RegExp | undefined,
  ): string | null {
    return (value instanceof RegExp ? value.source : value) || null;
  }
}

const transformRequestManager = new TransformRequestManager();

export { transformRequestManager as TransformRequestManager };
