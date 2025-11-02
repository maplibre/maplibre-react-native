import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface SnapshotJsonOptions {
  centerCoordinate?: string;
  zoomLevel?: number;

  bounds?: string;

  styleURL: string;
  heading: number;
  pitch: number;
  width: number;
  height: number;
  writeToDisk: boolean;
  withLogo: boolean;
}

export interface Spec extends TurboModule {
  takeSnap(options: SnapshotJsonOptions): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNSnapshotModule");
