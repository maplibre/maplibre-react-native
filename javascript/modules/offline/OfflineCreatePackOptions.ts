import {makeLatLngBounds} from '../../utils/geoUtils';
import {toJSONString} from '../../utils';

export interface OfflineCreatePackInputOptions {
  name: string;
  styleURL: string;
  bounds: [GeoJSON.Position, GeoJSON.Position];
  minZoom?: number;
  maxZoom?: number;
  metadata?: Record<string, any>;
}

class OfflineCreatePackOptions {
  name: string;
  styleURL: string;
  bounds: string;
  minZoom?: number;
  maxZoom?: number;
  metadata: string;

  constructor(options: OfflineCreatePackInputOptions) {
    this._assert(options);

    this.name = options.name;
    this.styleURL = options.styleURL;
    this.bounds = this._makeLatLngBounds(options.bounds);
    this.minZoom = options.minZoom;
    this.maxZoom = options.maxZoom;
    this.metadata = this._makeMetadata(options.metadata);
  }

  _assert(options: OfflineCreatePackInputOptions): void {
    if (!options.styleURL) {
      throw new Error(
        'Style URL must be provided for creating an offline pack',
      );
    }

    if (!options.name) {
      throw new Error('Name must be provided for creating an offline pack');
    }

    if (!options.bounds) {
      throw new Error('Bounds must be provided for creating an offline pack');
    }
  }

  _makeLatLngBounds(bounds: [GeoJSON.Position, GeoJSON.Position]): string {
    const ne = bounds[0];
    const sw = bounds[1];
    return toJSONString(makeLatLngBounds(ne, sw));
  }

  _makeMetadata(metadata?: Record<string, any>): string {
    return JSON.stringify({
      ...metadata,
      name: this.name,
    });
  }
}

export default OfflineCreatePackOptions;
