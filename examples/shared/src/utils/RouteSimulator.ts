import along from "@turf/along";
import findDistance from "@turf/distance";
import { point } from "@turf/helpers";
import { Animated } from "react-native";

type RouteSimulatorFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { distance: number; nearestIndex: number }
>;

class Polyline {
  private readonly coordinates: GeoJSON.Position[];
  private readonly lineStringFeature: GeoJSON.Feature<GeoJSON.LineString>;
  public readonly totalDistance: number;

  constructor(lineStringFeature: GeoJSON.Feature<GeoJSON.LineString>) {
    this.coordinates = lineStringFeature.geometry.coordinates;
    this.lineStringFeature = lineStringFeature;

    this.totalDistance = 0;
    for (let i = 1; i < this.coordinates.length; i++) {
      this.totalDistance += findDistance(this.get(i - 1), this.get(i));
    }
  }

  coordinateFromStart(distance: number): RouteSimulatorFeature {
    const pointAlong = along(this.lineStringFeature, distance);

    return {
      ...pointAlong,
      properties: {
        ...pointAlong.properties,
        distance,
        nearestIndex: this.findNearestFloorIndex(distance),
      },
    };
  }

  findNearestFloorIndex(currentDistance: number) {
    let runningDistance = 0;

    for (let i = 1; i < this.coordinates.length; i++) {
      runningDistance += findDistance(this.get(i - 1), this.get(i));

      if (runningDistance >= currentDistance) {
        return i - 1;
      }
    }

    return -1;
  }

  get(index: number) {
    const coordinates = this.coordinates[index];

    if (!coordinates) {
      throw new Error("RouteSimulator coordinates not found");
    }

    return point(coordinates);
  }
}

export class RouteSimulator {
  private readonly polyline: Polyline;
  private previousDistance: number;
  private currentDistance: number;
  private readonly speed: number;

  private animatedValue: Animated.Value | undefined;
  private anim: Animated.CompositeAnimation | undefined;
  private listener:
    | ((
        point: GeoJSON.Feature<
          GeoJSON.Point,
          { distance: number; nearestIndex: number }
        >,
      ) => void)
    | undefined;

  constructor(lineString: GeoJSON.Feature<GeoJSON.LineString>, speed = 0.04) {
    this.polyline = new Polyline(lineString);
    this.previousDistance = 0;
    this.currentDistance = 0;
    this.speed = speed;
  }

  addListener(
    listener: (
      point: GeoJSON.Feature<
        GeoJSON.Point,
        { distance: number; nearestIndex: number }
      >,
    ) => void,
  ) {
    this.listener = listener;
  }

  start() {
    this.tick();
  }

  reset() {
    this.previousDistance = 0;
    this.currentDistance = 0;
    this.start();
  }

  stop() {
    if (this.anim) {
      this.anim.stop();
    }
  }

  tick() {
    requestAnimationFrame(() => {
      this.previousDistance = this.currentDistance;
      this.currentDistance += this.speed;

      // interpolate between previous to current distance
      const listener: Animated.ValueListenerCallback = (step) => {
        const currentPosition = this.polyline.coordinateFromStart(step.value);
        this.emit(currentPosition);
      };

      this.animatedValue = new Animated.Value(
        this.previousDistance,
      ) as Animated.Value;
      const listenerId = this.animatedValue.addListener(listener);

      this.anim = Animated.timing(this.animatedValue, {
        toValue: this.currentDistance,
        duration: 5,
        useNativeDriver: false,
      });

      this.anim.start(() => {
        this.animatedValue?.removeListener(listenerId);

        if (this.currentDistance > this.polyline.totalDistance) {
          this.reset();
          return;
        }

        this.tick();
      });
    });
  }

  emit(pointFeature: RouteSimulatorFeature) {
    this.listener?.(pointFeature);
  }
}
