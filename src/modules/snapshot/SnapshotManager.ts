import { NativeModules } from "react-native";

import { SnapshotOptions, type SnapshotInputOptions } from "./SnapshotOptions";

const MLRNSnapshotModule = NativeModules.MLRNSnapshotModule;

/**
 * The SnapshotManager generates static raster images of the map.
 * Each snapshot image depicts a portion of a map defined by an SnapshotOptions object you provide.
 * The snapshotter generates the snapshot asynchronous.
 */
class SnapshotManager {
  /**
   * Takes a snapshot of the base map using the provided Snapshot options. NOTE pitch, heading, zoomLevel only works when centerCoordinate is set!
   *
   * @example
   *
   * // creates a temp file png of base map
   * const uri = await SnapshotManager.takeSnap({
   *   centerCoordinate: [-74.126410, 40.797968],
   *   width: width,
   *   height: height,
   *   zoomLevel: 12,
   *   pitch: 30,
   *   heading: 20,
   *   styleURL: StyleURL.Default,
   *   writeToDisk: true, // Create a temporary file
   * });
   *
   * // creates base64 png of base map without logo
   * const uri = await SnapshotManager.takeSnap({
   *   centerCoordinate: [-74.126410, 40.797968],
   *   width: width,
   *   height: height,
   *   zoomLevel: 12,
   *   pitch: 30,
   *   heading: 20,
   *   styleURL: StyleURL.Default,
   *   withLogo: false, // Disable Mapbox logo (Android only)
   * });
   *
   * // creates snapshot with bounds
   * const uri = await SnapshotManager.takeSnap({
   *   bounds: [[-74.126410, 40.797968], [-74.143727, 40.772177]],
   *   width: width,
   *   height: height,
   *   styleURL: StyleURL.Default,
   * });
   *
   * @param  {SnapshotOptions}  options Snapshot options for create a static image of the base map
   * @return {Promise}
   */
  async takeSnap(options: SnapshotInputOptions = {}): Promise<string> {
    const snapshotOptions = new SnapshotOptions(options);

    const uri = await MLRNSnapshotModule.takeSnap(snapshotOptions);
    return uri;
  }
}

const snapshotManager = new SnapshotManager();
export { snapshotManager as SnapshotManager };
