import {NativeModules} from 'react-native';

const MapLibreGLOfflineManager = NativeModules.MGLOfflineModule;

class OfflinePack {
  constructor(pack) {
    this.pack = pack;
    this._metadata = null;
  }

  get name() {
    const {metadata} = this;
    return metadata && metadata.name;
  }

  get bounds() {
    return this.pack.bounds;
  }

  get metadata() {
    if (!this._metadata && this.pack.metadata) {
      this._metadata = JSON.parse(this.pack.metadata);
    }
    return this._metadata;
  }

  status() {
    return MapLibreGLOfflineManager.getPackStatus(this.name);
  }

  resume() {
    return MapLibreGLOfflineManager.resumePackDownload(this.name);
  }

  pause() {
    return MapLibreGLOfflineManager.pausePackDownload(this.name);
  }
}

export default OfflinePack;
