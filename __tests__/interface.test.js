import MapLibreGL from '../javascript';

// TODO: Figure out why this test even exists. It appears to just test that a mock has certain properties, which seems stupid.
describe('Public Interface', () => {
  it('should contain all expected components and utils', () => {
    const actualKeys = Object.keys(MapLibreGL);
    const expectedKeys = [
      // components
      'MapView',
      // 'StyleSheet',
      'Light',
      'PointAnnotation',
      'MarkerView',
      'Annotation',
      'Callout',
      'Camera',
      'UserLocation',

      // modules
      'offlineManager',
      'snapshotManager',
      'locationManager',

      // layers
      'FillLayer',
      'FillExtrusionLayer',
      'CircleLayer',
      'HeatmapLayer',
      'LineLayer',
      'SymbolLayer',
      'BackgroundLayer',
      'RasterLayer',

      // sources
      'VectorSource',
      'ShapeSource',
      'RasterSource',
      'ImageSource',
      'Images',

      // constants
      'UserTrackingModes',
      'StyleURL',
      'EventTypes',
      'CameraModes',
      'StyleSource',
      'InterpolationMode',
      'LineJoin',
      'LineCap',
      'LineTranslateAnchor',
      'CirclePitchScale',
      'CircleTranslateAnchor',
      // 'CirclePitchAlignment',
      'FillExtrusionTranslateAnchor',
      'FillTranslateAnchor',
      'IconRotationAlignment',
      'IconTextFit',
      // 'IconAnchor',
      'IconTranslateAnchor',
      // 'IconPitchAlignment',
      'SymbolPlacement',
      'TextAnchor',
      'TextJustify',
      'TextPitchAlignment',
      'TextRotationAlignment',
      'TextTransform',
      'TextTranslateAnchor',
      'LightAnchor',
      'OfflinePackDownloadState',
      'OfflineCallbackName',

      // methods
      'setAccessToken',
      'getAccessToken',
      'setConnected',
      'requestAndroidLocationPermissions',

      // animated
      'Animated',

      // helpers
      'AnimatedPoint',
      'AnimatedCoordinatesArray',
      'AnimatedShape',
      'AnimatedExtractCoordinateFromArray',
      'AnimatedRouteCoordinatesArray',
      'Logger',
      'Style',
    ];
    actualKeys.forEach(key => expect(expectedKeys).toContain(key));
    expectedKeys.forEach(key => expect(actualKeys).toContain(key));
  });
});
