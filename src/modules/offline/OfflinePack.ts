import NativeOfflineModule from "./NativeOfflineModule";

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

type NativeOfflinePack = {
  bounds: readonly (readonly number[])[];
  metadata: string;
};

export class OfflinePack {
  private pack: NativeOfflinePack;
  private _metadata: Record<string, any> | null;

  constructor(pack: NativeOfflinePack) {
    this.pack = pack;
    this._metadata = null;
  }

  get name(): string | null {
    const { metadata } = this;
    return metadata && metadata.name;
  }

  get bounds(): readonly (readonly number[])[] {
    return this.pack.bounds;
  }

  get metadata(): Record<string, any> | null {
    if (!this._metadata && this.pack.metadata) {
      this._metadata = JSON.parse(this.pack.metadata);
    }
    return this._metadata;
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
