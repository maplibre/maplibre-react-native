import { Animated } from "react-native";

let uniqueID = 0;

const AnimatedWithChildren = Object.getPrototypeOf(
  Animated.ValueXY,
) as typeof Animated.AnimatedWithChildren;

export class AnimatedPoint extends AnimatedWithChildren {
  longitude: Animated.Value;
  latitude: Animated.Value;

  _lngLatListeners: Record<string, { longitude: string; latitude: string }>;

  constructor(
    point?:
      | GeoJSON.Point
      | { type: "Point"; coordinates: Animated.AnimatedValue[] },
  ) {
    super();

    const newLongitude = point?.coordinates[0] ?? 0;
    const newLatitude = point?.coordinates[1] ?? 0;

    if (newLongitude instanceof Animated.Value) {
      this.longitude = newLongitude;
    } else {
      this.longitude = new Animated.Value(newLongitude);
    }

    if (newLatitude instanceof Animated.Value) {
      this.latitude = newLatitude;
    } else {
      this.latitude = new Animated.Value(newLatitude);
    }

    this._lngLatListeners = {};
  }

  setValue(point?: GeoJSON.Point): void {
    this.longitude.setValue(point?.coordinates[0] ?? 0);
    this.latitude.setValue(point?.coordinates[1] ?? 0);
  }

  setOffset(point?: GeoJSON.Point): void {
    this.longitude.setOffset(point?.coordinates[0] ?? 0);
    this.latitude.setOffset(point?.coordinates[1] ?? 0);
  }

  flattenOffset(): void {
    this.longitude.flattenOffset();
    this.latitude.flattenOffset();
  }

  stopAnimation(callback?: (value: GeoJSON.Point) => void): void {
    this.longitude.stopAnimation();
    this.latitude.stopAnimation();

    if (typeof callback === "function") {
      callback(this.__getValue());
    }
  }

  addListener(callback?: (value: GeoJSON.Point) => void): string {
    uniqueID += 1;
    const id = `${uniqueID}-${Date.now()}`;

    const completeCallback = (): void => {
      if (typeof callback === "function") {
        callback(this.__getValue());
      }
    };

    this._lngLatListeners[id] = {
      longitude: this.longitude.addListener(completeCallback),
      latitude: this.latitude.addListener(completeCallback),
    };

    return id;
  }

  removeListener(id: string): void {
    const listener = this._lngLatListeners[id];

    if (listener) {
      this.longitude.removeListener(listener.longitude);
      this.latitude.removeListener(listener.latitude);
      delete this._lngLatListeners[id];
    }
  }

  spring(
    config?: Partial<Animated.TimingAnimationConfig> & {
      coordinates: GeoJSON.Position;
    },
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.spring(this.longitude, {
        ...config,
        toValue: config?.coordinates[0] ?? 0,
        useNativeDriver: false,
      }),
      Animated.spring(this.latitude, {
        ...config,
        toValue: config?.coordinates[1] ?? 0,
        useNativeDriver: false,
      }),
    ]);
  }

  timing(
    config?: Partial<Animated.TimingAnimationConfig> & {
      coordinates: GeoJSON.Position;
    },
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(this.longitude, {
        ...config,
        toValue: config?.coordinates[0] ?? 0,
        useNativeDriver: false,
      }),
      Animated.timing(this.latitude, {
        ...config,
        toValue: config?.coordinates[1] ?? 0,
        useNativeDriver: false,
      }),
    ]);
  }

  __getValue(): GeoJSON.Point {
    return {
      type: "Point",
      coordinates: [
        // @ts-ignore
        this.longitude.__getValue(),
        // @ts-ignore
        this.latitude.__getValue(),
      ],
    };
  }

  __attach(): void {
    // @ts-ignore
    this.longitude.__addChild(this);
    // @ts-ignore
    this.latitude.__addChild(this);
  }

  __detach(): void {
    // @ts-ignore
    this.longitude.__removeChild(this);
    // @ts-ignore
    this.latitude.__removeChild(this);
  }
}
