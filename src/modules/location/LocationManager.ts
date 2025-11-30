import {
  type EventSubscription,
  type Permission,
  PermissionsAndroid,
  Platform,
} from "react-native";

import NativeLocationModule from "./NativeLocationModule";

interface GeolocationCoordinates {
  /**
   * Longitude in degrees
   */
  longitude: number;

  /**
   * Latitude in degrees
   */
  latitude: number;

  /**
   * Accuracy for longitude/latitude in meters
   */
  accuracy: number;

  /**
   * Altitude in meters
   */
  altitude: number | null;

  /**
   * Accuracy for altitude in meters
   */
  altitudeAccuracy: number | null;

  /**
   * Direction in which the device is traveling in degrees, relative to north
   */
  heading: number | null;

  /**
   * Instantaneous speed of the device in meters per second
   */
  speed: number | null;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;

  timestamp: number;
}

class LocationManager {
  private listeners: ((location: GeolocationPosition) => void)[] = [];
  private currentPosition: GeolocationPosition | undefined = undefined;
  private isListening: boolean = false;

  private subscription: EventSubscription | undefined = undefined;

  constructor() {
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async getCurrentPosition(): Promise<GeolocationPosition | undefined> {
    let currentPosition;

    try {
      currentPosition = await NativeLocationModule.getCurrentPosition();
    } catch (error) {
      console.log("LocationManager [error]: ", error);
    }

    this.currentPosition = currentPosition;

    return this.currentPosition;
  }

  addListener(newListener: (location: GeolocationPosition) => void): void {
    if (!this.isListening) {
      this.start();
    }

    if (!this.listeners.includes(newListener)) {
      this.listeners.push(newListener);

      if (this.currentPosition) {
        newListener(this.currentPosition);
      }
    }
  }

  removeListener(oldListener: (location: GeolocationPosition) => void): void {
    this.listeners = this.listeners.filter(
      (listener) => listener !== oldListener,
    );

    if (this.listeners.length === 0) {
      this.stop();
    }
  }

  removeAllListeners(): void {
    this.listeners = [];

    this.stop();
  }

  start(): void {
    if (!this.isListening) {
      NativeLocationModule.start();

      this.subscription = NativeLocationModule.onUpdate(this.handleUpdate);

      this.isListening = true;
    }
  }

  stop(): void {
    NativeLocationModule.stop();

    if (this.isListening) {
      this.subscription?.remove();
    }

    this.isListening = false;
  }

  setMinDisplacement(minDisplacement: number): void {
    NativeLocationModule.setMinDisplacement(minDisplacement);
  }

  private handleUpdate(location: GeolocationPosition): void {
    this.currentPosition = location;

    this.listeners.forEach((listener) => listener(location));
  }

  /**
   * Request location permissions
   *
   * Requests the following:
   * - Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
   * - iOS: `requestWhenInUseAuthorization`
   *
   * @returns Promise resolves to true if permissions were granted, false otherwise
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      const res = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as Permission,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION as Permission,
      ]);

      return Object.values(res).every(
        (permission) => permission === PermissionsAndroid.RESULTS.GRANTED,
      );
    }

    if (Platform.OS === "ios") {
      try {
        await NativeLocationModule.requestPermissions();
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return false;
      }
    }

    return false;
  }
}

const locationManager = new LocationManager();
export { locationManager as LocationManager };
