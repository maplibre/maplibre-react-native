import { featureCollection, point } from "@turf/helpers";
import { NativeModules } from "react-native";

import { SnapshotOptions } from "../../../modules/snapshot/SnapshotOptions";

describe("SnapshotOptions", () => {
  it("should throw error if no centerCoordinate or bounds are provided", () => {
    expect(() => new SnapshotOptions()).toThrow();
    expect(() => new SnapshotOptions({ styleURL: "test" })).toThrow();
  });

  it("should create options with valid defaults", () => {
    const centerCoordinate = [1, 2];
    const options = new SnapshotOptions({ centerCoordinate });

    expect(options.toJSON()).toEqual({
      styleURL: NativeModules.MLRNModule.StyleURL.Default,
      heading: 0.0,
      pitch: 0.0,
      zoomLevel: 16.0,
      width: 50.0,
      height: 50.0,
      writeToDisk: false,
      centerCoordinate: JSON.stringify(point(centerCoordinate)),
      withLogo: true,
    });
  });

  it("should create options with centerCoordinate", () => {
    const expectedOptions = {
      centerCoordinate: [1, 2],
      heading: 60.0,
      pitch: 45.0,
      zoomLevel: 2.0,
      width: 314,
      height: 600,
      writeToDisk: true,
      withLogo: true,
      styleURL: NativeModules.MLRNModule.StyleURL.Default,
    };

    const options = new SnapshotOptions(expectedOptions);
    expect(options.toJSON()).toEqual({
      ...expectedOptions,
      centerCoordinate: JSON.stringify(point(expectedOptions.centerCoordinate)),
    });
  });

  it("should create options with bounds", () => {
    const expectedOptions = {
      bounds: [
        [1, 2],
        [3, 4],
      ],
      width: 400,
      height: 600,
      styleURL: NativeModules.MLRNModule.StyleURL.Default,
      writeToDisk: false,
      withLogo: true,
    };

    const geoJSONBounds = JSON.stringify(
      featureCollection(expectedOptions.bounds.map((c) => point(c))),
    );

    const options = new SnapshotOptions(expectedOptions);
    expect(options.toJSON()).toEqual({
      ...expectedOptions,
      heading: 0,
      pitch: 0,
      zoomLevel: 16,
      bounds: geoJSONBounds,
    });
  });
});
