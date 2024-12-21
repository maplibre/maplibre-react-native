import {
  NativeModules,
  NativeEventEmitter,
  type EmitterSubscription,
} from "react-native";

const MLRNModule = NativeModules.MLRNModule;
const MLRNLocationModule = NativeModules.MLRNLocationModule;

export const LocationModuleEventEmitter = new NativeEventEmitter(
  MLRNLocationModule,
);

/*
 * Location sent by LocationManager
 */
export interface Location {
  coords: Coordinates;
  timestamp?: number;
}

/*
 * Coordinates sent by LocationManager
 */
interface Coordinates {
  /*
   * The heading (measured in degrees) relative to true north.
   * Heading is used to describe the direction the device is pointing to (the value of the compass).
   * Note that on Android this is incorrectly reporting the course value as mentioned in issue https://github.com/rnmapbox/maps/issues/1213
   * and will be corrected in a future update.
   */
  heading?: number;

  /*
   * The direction in which the device is traveling, measured in degrees and relative to due north.
   * The course refers to the direction the device is actually moving (not the same as heading).
   */
  course?: number;

  /*
   * The instantaneous speed of the device, measured in meters per second.
   */
  speed?: number;

  /*
   * The latitude in degrees.
   */
  latitude: number;

  /*
   * The longitude in degrees.
   */
  longitude: number;

  /*
   * The radius of uncertainty for the location, measured in meters.
   */
  accuracy?: number;

  /*
   * The altitude, measured in meters.
   */
  altitude?: number;
}

class LocationManager {
  _listeners: ((location: Location) => void)[];
  _lastKnownLocation: Location | null;
  _isListening: boolean;
  subscription: EmitterSubscription | null;

  constructor() {
    this._listeners = [];
    this._lastKnownLocation = null;
    this._isListening = false;
    this.onUpdate = this.onUpdate.bind(this);
    this.subscription = null;
  }

  async getLastKnownLocation(): Promise<Location | null> {
    if (!this._lastKnownLocation) {
      let lastKnownLocation;

      // as location can be brittle it might happen,
      // that we get an exception from native land
      // let's silently catch it and simply log out
      // instead of throwing an exception
      try {
        lastKnownLocation = await MLRNLocationModule.getLastKnownLocation();
      } catch (error) {
        console.log("LocationManager Error: ", error);
      }

      if (!this._lastKnownLocation && lastKnownLocation) {
        this._lastKnownLocation = lastKnownLocation;
      }
    }

    return this._lastKnownLocation;
  }

  addListener(listener: (location: Location) => void): void {
    if (!this._isListening) {
      this.start();
    }
    if (!this._listeners.includes(listener)) {
      this._listeners.push(listener);

      if (this._lastKnownLocation) {
        listener(this._lastKnownLocation);
      }
    }
  }

  removeListener(listener: (location: Location) => void): void {
    this._listeners = this._listeners.filter((l) => l !== listener);
    if (this._listeners.length === 0) {
      this.stop();
    }
  }

  removeAllListeners(): void {
    this._listeners = [];
    this.stop();
  }

  start(displacement = 0): void {
    if (!this._isListening) {
      MLRNLocationModule.start(displacement);

      this.subscription = LocationModuleEventEmitter.addListener(
        MLRNModule.LocationCallbackName.Update,
        this.onUpdate,
      );

      this._isListening = true;
    }
  }

  stop(): void {
    MLRNLocationModule.stop();

    if (this._isListening) {
      this.subscription?.remove();
    }

    this._isListening = false;
  }

  setMinDisplacement(minDisplacement: number): void {
    MLRNLocationModule.setMinDisplacement(minDisplacement);
  }

  onUpdate(location: Location): void {
    this._lastKnownLocation = location;

    this._listeners.forEach((l) => l(location));
  }
}

const locationManager = new LocationManager();
export { locationManager as LocationManager };
