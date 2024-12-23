import { NativeModules } from "react-native";

import { OfflineCreatePackOptions } from "./OfflineCreatePackOptions";

const MLRNOfflineModule = NativeModules.MLRNOfflineModule;

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

export class OfflinePack {
  private pack: OfflineCreatePackOptions;
  private _metadata: Record<string, any> | null;

  constructor(pack: OfflineCreatePackOptions) {
    this.pack = pack;
    this._metadata = null;
  }

  get name(): string | null {
    const { metadata } = this;
    return metadata && metadata.name;
  }

  get bounds(): string {
    return this.pack.bounds;
  }

  get metadata(): Record<string, any> | null {
    if (!this._metadata && this.pack.metadata) {
      this._metadata = JSON.parse(this.pack.metadata);
    }
    return this._metadata;
  }

  status(): Promise<OfflinePackStatus> {
    return MLRNOfflineModule.getPackStatus(this.name);
  }

  resume(): Promise<void> {
    return MLRNOfflineModule.resumePackDownload(this.name);
  }

  pause(): Promise<void> {
    return MLRNOfflineModule.pausePackDownload(this.name);
  }
}
