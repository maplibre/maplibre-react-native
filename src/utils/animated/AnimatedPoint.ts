import { Animated } from "react-native";

// Used react-native-maps as a reference
// https://github.com/react-community/react-native-maps/blob/master/lib/components/AnimatedRegion.js
const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

const DEFAULT_COORD = [0, 0];
const DEFAULT_POINT = { type: "Point", coordinates: DEFAULT_COORD };

let uniqueID = 0;

export class AnimatedPoint extends AnimatedWithChildren {
  constructor(point = DEFAULT_POINT) {
    super();

    this.longitude = point.coordinates[0] || 0;
    this.latitude = point.coordinates[1] || 0;

    if (!(this.longitude instanceof Animated.Value)) {
      this.longitude = new Animated.Value(this.longitude);
    }

    if (!(this.latitude instanceof Animated.Value)) {
      this.latitude = new Animated.Value(this.latitude);
    }

    this._listeners = {};
  }

  setValue(point = DEFAULT_POINT): void {
    this.longitude.setValue(point.coordinates[0]);
    this.latitude.setValue(point.coordinates[1]);
  }

  setOffset(point = DEFAULT_POINT): void {
    this.longitude.setOffset(point.coordinates[0]);
    this.latitude.setOffset(point.coordinates[1]);
  }

  flattenOffset(): void {
    this.longitude.flattenOffset();
    this.latitude.flattenOffset();
  }

  stopAnimation(cb?: (value: GeoJSON.Point) => void): void {
    this.longitude.stopAnimation();
    this.latitude.stopAnimation();

    if (typeof cb === "function") {
      cb(this.__getValue());
    }
  }

  addListener(cb?: (value: GeoJSON.Point) => void): string {
    uniqueID += 1;
    const id = `${String(uniqueID)}-${String(Date.now())}`;

    const completeCB = (): void => {
      if (typeof cb === "function") {
        cb(this.__getValue());
      }
    };

    this._listeners[id] = {
      longitude: this.longitude.addListener(completeCB),
      latitude: this.latitude.addListener(completeCB),
    };

    return id;
  }

  removeListener(id: string): void {
    this.longitude.removeListener(this._listeners[id].longitude);
    this.latitude.removeListener(this._listeners[id].latitude);
    delete this._listeners[id];
  }

  spring(
    config: Partial<Animated.TimingAnimationConfig> & {
      coordinates: GeoJSON.Position;
    } = { coordinates: DEFAULT_COORD },
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.spring(this.longitude, {
        ...config,
        toValue: config.coordinates[0]!,
        useNativeDriver: false,
      }),
      Animated.spring(this.latitude, {
        ...config,
        toValue: config.coordinates[1]!,
        useNativeDriver: false,
      }),
    ]);
  }

  timing(
    config: Partial<Animated.TimingAnimationConfig> & {
      coordinates: GeoJSON.Position;
    } = { coordinates: DEFAULT_COORD },
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(this.longitude, {
        ...config,
        toValue: config.coordinates[0]!,
        useNativeDriver: false,
      }),
      Animated.timing(this.latitude, {
        ...config,
        toValue: config.coordinates[1]!,
        useNativeDriver: false,
      }),
    ]);
  }

  __getValue(): GeoJSON.Point {
    return {
      type: "Point",
      coordinates: [this.longitude.__getValue(), this.latitude.__getValue()],
    };
  }

  __attach(): void {
    this.longitude.__addChild(this);
    this.latitude.__addChild(this);
  }

  __detach(): void {
    this.longitude.__removeChild(this);
    this.latitude.__removeChild(this);
  }
}
