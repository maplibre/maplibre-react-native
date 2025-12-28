import NativeOfflineModule from "./NativeOfflineModule";
import type { LngLatBounds } from "../../types/LngLatBounds";

export type OfflinePackStatus = {
  name: string;
  state: number;
  percentage: number;
  completedResourceCount: number;
  completedResourceSize: number;
  completedTileCount: number;
  completedTileSize: number;
  requiredResourceCount: number;
};

export interface OfflinePackMetadata {
  name: string;
  [key: string]: unknown;
}

type NativeOfflinePack = {
  bounds: LngLatBounds;
  metadata: string;
};

export class OfflinePack {
  private pack: NativeOfflinePack;
  private parsedMetadata: OfflinePackMetadata | null;

  constructor(pack: NativeOfflinePack) {
    this.pack = pack;
    this.parsedMetadata = null;
  }

  get name(): string | null {
    const { metadata } = this;
    return metadata && metadata.name;
  }

  get bounds(): LngLatBounds {
    return this.pack.bounds;
  }

  get metadata(): OfflinePackMetadata | null {
    if (!this.parsedMetadata && this.pack.metadata) {
      this.parsedMetadata = JSON.parse(this.pack.metadata);
    }
    return this.parsedMetadata;
  }

  async status(): Promise<OfflinePackStatus | null> {
    if (!this.name) {
      return null;
    }
    return NativeOfflineModule.getPackStatus(this.name);
  }

  async resume(): Promise<void> {
    if (!this.name) {
      return;
    }
    return NativeOfflineModule.resumePackDownload(this.name);
  }

  async pause(): Promise<void> {
    if (!this.name) {
      return;
    }
    return NativeOfflineModule.pausePackDownload(this.name);
  }
}
