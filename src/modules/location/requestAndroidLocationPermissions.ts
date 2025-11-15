import { LocationManager } from "./LocationManager";

/**
 * @deprected Use `LocationManager.requestAndroidPermissions` instead
 */
export async function requestAndroidLocationPermissions(): Promise<boolean> {
  return LocationManager.requestAndroidPermissions();
}
