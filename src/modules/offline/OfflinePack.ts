import NativeOfflineModule, {
  type NativeOfflinePack,
} from "./NativeOfflineModule";
import type { OfflinePackDownloadState } from "./OfflineManager";
import type { LngLatBounds } from "../../types/LngLatBounds";

export type OfflinePackStatus = {
  id: string;
  state: OfflinePackDownloadState;
  percentage: number;
  completedResourceCount: number;
  completedResourceSize: number;
  completedTileCount: number;
  completedTileSize: number;
  requiredResourceCount: number;
};

export class OfflinePack {
  /** Unique Identifier (UUID), auto-generated natively during creation. */
  public id: string;

  /** User-provided metadata object. */
  public metadata: Record<string, unknown>;

  public bounds: LngLatBounds;

  constructor(pack: NativeOfflinePack) {
    this.id = pack.id;
    this.bounds = pack.bounds as LngLatBounds;
    this.metadata = JSON.parse(pack.metadata);
  }

  async status(): Promise<OfflinePackStatus> {
    return NativeOfflineModule.getPackStatus(this.id);
  }

  async resume(): Promise<void> {
    return NativeOfflineModule.resumePackDownload(this.id);
  }

  async pause(): Promise<void> {
    return NativeOfflineModule.pausePackDownload(this.id);
  }
}
