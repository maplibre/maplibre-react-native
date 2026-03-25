import NativeNetworkModule from "./NativeNetworkModule";

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
  match?: string | RegExp;
}

/**
 * A serializable transform for rewriting MapLibre request URLs.
 *
 * Transforms are applied as a pipeline in the order they were added: transform N+1 sees
 * the URL *after* transform N has possibly changed it.
 */
export interface UrlTransform extends TransformOptions {
  /**
   * Regex to find the portion of the URL to replace.
   * Supports capture groups that can be back-referenced in `replace` as `$1`, `$2`, …
   */
  find: string;

  /**
   * Replacement string. Reference capture groups from `find` with `$1`, `$2`, …
   */
  replace: string;
}

/**
 * NetworkManager provides methods for managing HTTP requests made by MapLibre.
 * This includes adding custom headers to tile requests and controlling network connectivity.
 */
class NetworkManager {
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
   * NetworkManager.addUrlTransform("force-https", {
   *   find: "^http://",
   *   replace: "https://",
   * });
   *
   * @example
   * // Redirect a specific domain through a proxy
   * NetworkManager.addUrlTransform("proxy", {
   *   match: "tiles\\.example\\.com",
   *   find: "tiles\\.example\\.com",
   *   replace: "proxy.example.com",
   * });
   *
   * @example
   * // Inject an API key into the path using a capture group
   * NetworkManager.addUrlTransform("api-key", {
   *   match: "api\\.example\\.com",
   *   find: "(https://api\\.example\\.com/)(.*)",
   *   replace: "$1mySecretKey/$2",
   * });
   *
   * @param transform The transform. Set {@link TransformOptions.id} to a stable string to
   *   enable in-place updates; if omitted an id is auto-generated and returned.
   *
   * @returns The id of the transform (the value of `transform.id` when provided, otherwise
   *   the auto-generated one). Pass it to {@link removeUrlTransform} to remove it later.
   */
  addUrlTransform(transform: UrlTransform): string {
    const id = transform.id ?? this.getId();

    NativeNetworkModule.addUrlTransform(
      id,
      NetworkManager.toRegexString(transform.match),
      transform.find,
      transform.replace,
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
   * Adds a URL query parameter that will be appended to all matching map resource requests.
   * This is useful for adding authentication tokens (like Mapbox access_token) to tile,
   * sprite, and glyph requests.
   *
   * @example
   * // Add access_token to all Mapbox API requests
   * NetworkManager.addUrlSearchParam("access_token", "pk.your-mapbox-token", /api\.mapbox\.com/);
   *
   * // Add api_key to all requests (no pattern = matches all)
   * NetworkManager.addUrlSearchParam("api_key", "your-api-key");
   *
   * @param name The query parameter name (e.g., "access_token")
   * @param value The query parameter value (e.g., your API token)
   * @param match Optional regex pattern to match against request URLs. If provided, the
   *              parameter will only be added to requests whose URLs match this pattern.
   *              Can be a RegExp object or a regex string.
   */
  addUrlSearchParam(
    name: string,
    value: string,
    match?: string | RegExp,
  ): void {
    NativeNetworkModule.addUrlSearchParam(
      name,
      value,
      NetworkManager.toRegexString(match),
    );
  }

  /**
   * Removes a previously added URL query parameter.
   *
   * @example
   * ```ts
   * NetworkManager.removeUrlSearchParam("access_token");
   * ```
   *
   * @param name The query parameter key to remove
   */
  removeUrlSearchParam(name: string): void {
    NativeNetworkModule.removeUrlSearchParam(name);
  }

  /**
   * Adds a custom HTTP header that will be sent with all map tile requests.
   * This is useful for adding authentication tokens or other custom headers
   * required by your tile server.
   *
   * @example
   * // Add header to all requests
   * NetworkManager.addHeader("Authorization", "Bearer token123");
   *
   * // Add header only to requests matching a regex pattern (string)
   * NetworkManager.addHeader("X-API-Key", "key123", "https:\\/\\/api\\.example\\.com\\/tiles\\/");
   *
   * // Add header only to requests matching a regex pattern (RegExp)
   * NetworkManager.addHeader("X-API-Key", "key123", /https:\/\/api\.example\.com\/tiles\//);
   *
   * @param name The name of the header (e.g., "Authorization")
   * @param value The value of the header (e.g., "Bearer token123")
   * @param match Optional regex pattern to match against network URLs. If provided, the header will only be added to requests whose URLs match this pattern. Can be a RegExp object or a regex string.
   */
  addHeader(name: string, value: string, match?: string | RegExp): void {
    NativeNetworkModule.addHeader(
      name,
      value,
      NetworkManager.toRegexString(match),
    );
  }

  /**
   * Removes a previously added custom HTTP header.
   *
   * @example
   * ```ts
   * NetworkManager.removeHeader("Authorization");
   * ```
   *
   * @param name The name of the header to remove
   */
  removeHeader(name: string): void {
    NativeNetworkModule.removeHeader(name);
  }

  /**
   * Android only: Sets the connectivity state of the map. When set to false, the map will
   * not make any network requests and will only use cached tiles. This is
   * useful for implementing offline mode or reducing data usage.
   *
   * @example
   * ```ts
   * // Enable offline mode
   * NetworkManager.setConnected(false);
   *
   * // Re-enable network requests
   * NetworkManager.setConnected(true);
   * ```
   *
   * @param connected Whether the map should be connected to the network
   */
  setConnected(connected: boolean): void {
    NativeNetworkModule.setConnected(connected);
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

const transformRequestManager = new NetworkManager();

export { transformRequestManager as NetworkManager };
