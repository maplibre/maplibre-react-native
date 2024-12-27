import { featureCollection, point } from "@turf/helpers";
import { NativeModules } from "react-native";

import { toJSONString } from "../../utils";

const MLRNModule = NativeModules.MLRNModule;

export interface SnapshotInputOptions {
  centerCoordinate?: GeoJSON.Position;
  bounds?: GeoJSON.Position[];
  styleURL?: string;
  heading?: number;
  pitch?: number;
  zoomLevel?: number;
  width?: number;
  height?: number;
  writeToDisk?: boolean;
  withLogo?: boolean;
}

interface SnapshotJsonOptions {
  centerCoordinate?: string;
  bounds?: string;
  styleURL: string;
  heading: number;
  pitch: number;
  zoomLevel: number;
  width: number;
  height: number;
  writeToDisk: boolean;
  withLogo: boolean;
}

export class SnapshotOptions {
  centerCoordinate?: string;
  bounds?: string;
  styleURL: string;
  heading: number;
  pitch: number;
  zoomLevel: number;
  width: number;
  height: number;
  writeToDisk: boolean;
  withLogo: boolean;

  constructor(options: SnapshotInputOptions) {
    if (!options.centerCoordinate && !options.bounds) {
      throw new Error(
        "Center coordinate or bounds must be supplied in order to take a snapshot",
      );
    }

    this.styleURL = options.styleURL || MLRNModule.StyleURL.Default;
    this.heading = options.heading || 0.0;
    this.pitch = options.pitch || 0.0;
    this.zoomLevel = options.zoomLevel || 16.0;
    this.width = options.width || 50.0;
    this.height = options.height || 50.0;
    this.writeToDisk = options.writeToDisk || false;
    this.withLogo = options.withLogo === undefined ? true : options.withLogo;

    if (options.centerCoordinate) {
      this.centerCoordinate = this._createCenterCoordPoint(
        options.centerCoordinate,
      );
    }

    if (options.bounds) {
      this.bounds = this._createBoundsCollection(options.bounds);
    }
  }

  toJSON(): SnapshotJsonOptions {
    return {
      styleURL: this.styleURL,
      heading: this.heading,
      pitch: this.pitch,
      zoomLevel: this.zoomLevel,
      width: this.width,
      height: this.height,
      writeToDisk: this.writeToDisk,
      centerCoordinate: this.centerCoordinate,
      bounds: this.bounds,
      withLogo: this.withLogo,
    };
  }

  _createCenterCoordPoint(centerCoordinate: GeoJSON.Position): string {
    return toJSONString(point(centerCoordinate));
  }

  _createBoundsCollection(bounds: GeoJSON.Position[]): string {
    const features = [];

    for (const bound of bounds) {
      features.push(point(bound));
    }

    return toJSONString(featureCollection(features));
  }
}
