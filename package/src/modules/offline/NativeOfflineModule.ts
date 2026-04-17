import type { CodegenTypes, TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeOfflinePackDownloadState = "inactive" | "active" | "complete";

export type NativeOfflinePack = {
  id: string;
  bounds: CodegenTypes.Double[];
  metadata: string;
};

type NativeOfflinePackCreateOptions = {
  mapStyle: string;
  bounds: CodegenTypes.Double[];
  minZoom: CodegenTypes.Double;
  maxZoom: CodegenTypes.Double;
  metadata: string;
};

type NativeOfflinePackStatus = {
  id: string;
  state: NativeOfflinePackDownloadState;
  percentage: CodegenTypes.Double;
  completedResourceCount: CodegenTypes.Int32;
  completedResourceSize: CodegenTypes.Int32;
  completedTileCount: CodegenTypes.Int32;
  completedTileSize: CodegenTypes.Int32;
  requiredResourceCount: CodegenTypes.Int32;
};

type NativeOfflinePackError = {
  id: string;
  message: string;
};

export interface Spec extends TurboModule {
  createPack(
    options: NativeOfflinePackCreateOptions,
  ): Promise<NativeOfflinePack>;
  getPacks(): Promise<NativeOfflinePack[]>;
  deletePack(id: string): Promise<void>;
  invalidatePack(id: string): Promise<void>;

  pausePackDownload(id: string): Promise<void>;
  resumePackDownload(id: string): Promise<void>;
  getPackStatus(id: string): Promise<NativeOfflinePackStatus>;
  setPackObserver(id: string): Promise<boolean>;

  invalidateAmbientCache(): Promise<void>;
  clearAmbientCache(): Promise<void>;
  setMaximumAmbientCacheSize(size: number): Promise<void>;
  resetDatabase(): Promise<void>;

  mergeOfflineRegions(path: string): Promise<void>;

  setTileCountLimit(limit: number): void;
  setProgressEventThrottle(throttleValue: number): void;

  readonly onProgress: CodegenTypes.EventEmitter<NativeOfflinePackStatus>;
  readonly onError: CodegenTypes.EventEmitter<NativeOfflinePackError>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNOfflineModule");
