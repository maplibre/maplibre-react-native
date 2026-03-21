import NativeNetworkModule from "./NativeNetworkModule";

/**
 * NetworkManager provides methods for managing HTTP requests made by MapLibre.
 * This includes adding custom headers to tile requests and controlling network connectivity.
 */
class NetworkManager {
  /**
   * Adds a custom HTTP header that will be sent with all map tile requests.
   * This is useful for adding authentication tokens or other custom headers
   * required by your tile server.
   *
   * @example
   * // Add header to all requests
   * NetworkManager.addRequestHeader("Authorization", "Bearer token123");
   *
   * // Add header only to requests matching a regex pattern (string)
   * NetworkManager.addRequestHeader("X-API-Key", "key123", "https:\\/\\/api\\.example\\.com\\/tiles\\/");
   *
   * // Add header only to requests matching a regex pattern (RegExp)
   * NetworkManager.addRequestHeader("X-API-Key", "key123", /https:\/\/api\.example\.com\/tiles\//);
   *
   * @param name The name of the header (e.g., "Authorization")
   * @param value The value of the header (e.g., "Bearer token123")
   * @param match Optional regex pattern to match against network URLs. If provided, the header will only be added to requests whose URLs match this pattern. Can be a RegExp object or a regex string.
   */
  static addRequestHeader(
    name: string,
    value: string,
    match?: string | RegExp,
  ): void {
    NativeNetworkModule.addRequestHeader(
      name,
      value,
      (match instanceof RegExp ? match.source : match) || null,
    );
  }

  /**
   * Removes a previously added custom HTTP header.
   *
   * @example
   * ```ts
   * NetworkManager.removeRequestHeader("Authorization");
   * ```
   *
   * @param headerName The name of the header to remove
   */
  static removeRequestHeader(headerName: string): void {
    NativeNetworkModule.removeRequestHeader(headerName);
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
  static setConnected(connected: boolean): void {
    NativeNetworkModule.setConnected(connected);
  }

  /**
   * Adds a URL query parameter that will be appended to all matching map resource requests.
   * This is useful for adding authentication tokens (like Mapbox access_token) to tile,
   * sprite, and glyph requests.
   *
   * @example
   * // Add access_token to all Mapbox API requests
   * NetworkManager.addUrlParam("access_token", "pk.your-mapbox-token", /api\.mapbox\.com/);
   *
   * // Add api_key to all requests (no pattern = matches all)
   * NetworkManager.addUrlParam("api_key", "your-api-key");
   *
   * @param key The query parameter key (e.g., "access_token")
   * @param value The query parameter value (e.g., your API token)
   * @param match Optional regex pattern to match against request URLs. If provided, the
   *              parameter will only be added to requests whose URLs match this pattern.
   *              Can be a RegExp object or a regex string.
   */
  static addUrlParam(
    key: string,
    value: string,
    match?: string | RegExp,
  ): void {
    NativeNetworkModule.addUrlParam(
      key,
      value,
      (match instanceof RegExp ? match.source : match) || null,
    );
  }

  /**
   * Removes a previously added URL query parameter.
   *
   * @example
   * ```ts
   * NetworkManager.removeUrlParam("access_token");
   * ```
   *
   * @param key The query parameter key to remove
   */
  static removeUrlParam(key: string): void {
    NativeNetworkModule.removeUrlParam(key);
  }
}

export { NetworkManager };
