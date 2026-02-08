import { Animated } from "react-native";

let uniqueID = 0;

type AnimatedPointValueIn =
  | GeoJSON.Point
  | { type: "Point"; coordinates: Animated.AnimatedValue[] };

const AnimatedWithChildren = Object.getPrototypeOf(
  Animated.ValueXY,
) as typeof Animated.AnimatedWithChildren;

export class AnimatedPoint extends AnimatedWithChildren {
  longitude: Animated.Value;
  latitude: Animated.Value;

  _lngLatListeners: Record<string, { longitude: string; latitude: string }>;

  constructor(valueIn?: AnimatedPointValueIn) {
    super();

    const longitudeIn = valueIn?.coordinates[0] ?? 0;
    const latitudeIn = valueIn?.coordinates[1] ?? 0;

    if (longitudeIn instanceof Animated.Value) {
      this.longitude = longitudeIn;
    } else {
      this.longitude = new Animated.Value(longitudeIn);
    }

    if (latitudeIn instanceof Animated.Value) {
      this.latitude = latitudeIn;
    } else {
      this.latitude = new Animated.Value(latitudeIn);
    }

    this._lngLatListeners = {};
  }

  setValue(value: GeoJSON.Point): void {
    this.longitude.setValue(value.coordinates[0] ?? 0);
    this.latitude.setValue(value.coordinates[1] ?? 0);
  }

  setOffset(offset: GeoJSON.Point): void {
    this.longitude.setOffset(offset.coordinates[0] ?? 0);
    this.latitude.setOffset(offset.coordinates[1] ?? 0);
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

  spring({
    toValue,
    ...config
  }: Omit<Animated.SpringAnimationConfig, "useNativeDriver" | "toValue"> & {
    toValue: GeoJSON.Point;
  }): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.spring(this.longitude, {
        ...config,
        toValue: toValue.coordinates[0] ?? 0,
        useNativeDriver: false,
      }),
      Animated.spring(this.latitude, {
        ...config,
        toValue: toValue.coordinates[1] ?? 0,
        useNativeDriver: false,
      }),
    ]);
  }

  timing({
    toValue,
    ...config
  }: Omit<Animated.TimingAnimationConfig, "useNativeDriver" | "toValue"> & {
    toValue: GeoJSON.Point;
  }): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(this.longitude, {
        ...config,
        toValue: toValue.coordinates[0] ?? 0,
        useNativeDriver: false,
      }),
      Animated.timing(this.latitude, {
        ...config,
        toValue: toValue.coordinates[1] ?? 0,
        useNativeDriver: false,
      }),
    ]);
  }

  __getValue(): GeoJSON.Point {
    return {
      type: "Point",
      coordinates: [
        (this.longitude as any).__getValue(),
        (this.latitude as any).__getValue(),
      ],
    };
  }

  __attach(): void {
    (this.longitude as any).__addChild(this);
    (this.latitude as any).__addChild(this);
  }

  __detach(): void {
    (this.longitude as any).__removeChild(this);
    (this.latitude as any).__removeChild(this);
    // @ts-ignore
    super.__detach();
  }
}
