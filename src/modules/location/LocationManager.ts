import type { EventSubscription } from "react-native";

import NativeLocationModule from "./NativeLocationModule";

interface GeolocationCoordinates {
  /*
   * Longitude in degrees
   */
  longitude: number;

  /*
   * Latitude in degrees
   */
  latitude: number;

  /*
   * Altitude in meters
   */
  altitude?: number;

  /*
   * Radius of uncertainty for the location in meters
   */
  accuracy?: number;

  /*
   * Heading in degrees, relative to true north
   *
   * Heading is used to describe the direction the device is pointing to (the value of the compass).
   * TODO: On Android this is incorrectly reporting the course value, see:
   *  https://github.com/rnmapbox/maps/issues/1213
   */
  heading?: number;

  /*
   * Direction in which the device is traveling in degrees, relative to north
   *
   * The course refers to the direction the device is actually moving (not the same as heading).
   */
  course?: number;

  /*
   * Instantaneous speed of the device in meters per second
   */
  speed?: number;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;

  timestamp: number;
}

class LocationManager {
  private listeners: ((location: GeolocationPosition) => void)[] = [];
  private lastKnownLocation: GeolocationPosition | null = null;
  private isListening: boolean = false;

  subscription: EventSubscription | null = null;

  constructor() {
    this.onUpdate = this.onUpdate.bind(this);
  }

  async getLastKnownLocation(): Promise<GeolocationPosition | null> {
    if (!this.lastKnownLocation) {
      let lastKnownLocation;

      try {
        lastKnownLocation = await NativeLocationModule.getCurrentPosition();
      } catch (error) {
        console.log("LocationManager Error: ", error);
      }

      if (!this.lastKnownLocation && lastKnownLocation) {
        this.lastKnownLocation = lastKnownLocation;
      }
    }

    return this.lastKnownLocation;
  }

  addListener(newListener: (location: GeolocationPosition) => void): void {
    if (!this.isListening) {
      this.start();
    }

    if (!this.listeners.includes(newListener)) {
      this.listeners.push(newListener);

      if (this.lastKnownLocation) {
        newListener(this.lastKnownLocation);
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

  start(displacement = 0): void {
    if (!this.isListening) {
      NativeLocationModule.start(displacement);

      this.subscription = NativeLocationModule.onUpdate(this.onUpdate);

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

  onUpdate(location: GeolocationPosition): void {
    this.lastKnownLocation = location;

    this.listeners.forEach((listener) => listener(location));
  }
}

const locationManager = new LocationManager();
export { locationManager as LocationManager };
