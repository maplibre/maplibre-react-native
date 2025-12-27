import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeOfflinePack = {
  bounds: readonly (readonly CodegenTypes.Double[])[];
  metadata: string;
};

type NativeOfflinePackStatus = {
  name: string;
  state: CodegenTypes.Int32;
  percentage: CodegenTypes.Double;
  completedResourceCount: CodegenTypes.Int32;
  completedResourceSize: CodegenTypes.Int32;
  completedTileCount: CodegenTypes.Int32;
  completedTileSize: CodegenTypes.Int32;
  requiredResourceCount: CodegenTypes.Int32;
};

type NativeOfflinePackError = {
  name: string;
  message: string;
};

export interface Spec extends TurboModule {
  // Pack management
  createPack(options: object): Promise<NativeOfflinePack>;
  getPacks(): Promise<NativeOfflinePack[]>;
  deletePack(name: string): Promise<void>;
  invalidatePack(name: string): Promise<void>;

  // Pack download control
  pausePackDownload(name: string): Promise<void>;
  resumePackDownload(name: string): Promise<void>;
  getPackStatus(name: string): Promise<NativeOfflinePackStatus | null>;
  setPackObserver(name: string): Promise<boolean>;

  // Cache management
  invalidateAmbientCache(): Promise<void>;
  clearAmbientCache(): Promise<void>;
  setMaximumAmbientCacheSize(size: number): Promise<void>;
  resetDatabase(): Promise<void>;

  // Import/merge
  mergeOfflineRegions(path: string): Promise<void>;

  // Configuration (sync methods)
  setTileCountLimit(limit: number): void;
  setProgressEventThrottle(throttleValue: number): void;

  // Event emitters
  readonly onProgress: CodegenTypes.EventEmitter<NativeOfflinePackStatus>;
  readonly onError: CodegenTypes.EventEmitter<NativeOfflinePackError>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNOfflineModule");
