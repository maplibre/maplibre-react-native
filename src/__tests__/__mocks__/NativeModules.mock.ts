import { NativeModules } from "react-native";

function keyMirror(keys: string[]) {
  const obj: Record<string, string> = {};
  keys.forEach((key) => (obj[key] = key));
  return obj;
}

// Mock of what the native code puts on the JS object
NativeModules.MLRNModule = {
  // constants
  StyleURL: keyMirror(["Default"]),
  StyleSource: keyMirror(["DefaultSourceID"]),

  // Methods
  addCustomHeader: jest.fn(),
  removeCustomHeader: jest.fn(),

  setConnected: jest.fn(),
};

export const mockNativeComponents: Record<string, any> = {
  MLRNNativeUserLocation: "MLRNNativeUserLocation",
};

jest.mock("react-native/Libraries/Utilities/codegenNativeComponent", () => {
  const codegenNativeComponent = jest.requireActual(
    "react-native/Libraries/Utilities/codegenNativeComponent",
  );

  return {
    default: (componentName: string) => {
      return (
        mockNativeComponents[componentName] ??
        codegenNativeComponent.default(componentName)
      );
    },
  };
});

export const mockNativeModuleSubscription = { remove: jest.fn() };

export const mockNativeModules: Record<string, any> = {
  MLRNCameraModule: {
    setStop: jest.fn(),
  },

  MLRNLocationModule: {
    getCurrentPosition: jest.fn(),
    setMinDisplacement: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    requestPermissions: jest.fn(),
    onUpdate: jest.fn(() => mockNativeModuleSubscription),
  },

  MLRNLogModule: {
    onLog: jest.fn(() => mockNativeModuleSubscription),
    setLogLevel: jest.fn(),
  },

  MLRNMapViewModule: {
    getCenter: jest.fn(),
    getZoom: jest.fn(),
    getBearing: jest.fn(),
    getPitch: jest.fn(),
    getBounds: jest.fn(),
    getViewState: jest.fn(),
    project: jest.fn(),
    unproject: jest.fn(),
    queryRenderedFeaturesWithPoint: jest.fn(),
    queryRenderedFeaturesWithBounds: jest.fn(),
    takeSnap: jest.fn(),
    setSourceVisibility: jest.fn(),
    showAttribution: jest.fn(),
  },

  MLRNOfflineModule: {
    createPack: jest.fn((packOptions: any) => {
      // Generate a mock UUID like native does
      const mockId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      return Promise.resolve({
        bounds: packOptions.bounds,
        metadata: JSON.stringify({ id: mockId, name: packOptions.name }),
      });
    }),
    getPacks: jest.fn(() => Promise.resolve([])),
    deletePack: jest.fn(() => Promise.resolve()),
    getPackStatus: jest.fn(() => Promise.resolve({})),
    pausePackDownload: jest.fn(() => Promise.resolve()),
    resumePackDownload: jest.fn(() => Promise.resolve()),
    setPackObserver: jest.fn(() => Promise.resolve()),
    invalidatePack: jest.fn(() => Promise.resolve()),
    invalidateAmbientCache: jest.fn(() => Promise.resolve()),
    clearAmbientCache: jest.fn(() => Promise.resolve()),
    setMaximumAmbientCacheSize: jest.fn(() => Promise.resolve()),
    resetDatabase: jest.fn(() => Promise.resolve()),
    mergeOfflineRegions: jest.fn(() => Promise.resolve()),
    setTileCountLimit: jest.fn(),
    setProgressEventThrottle: jest.fn(),
    onProgress: jest.fn(() => mockNativeModuleSubscription),
    onError: jest.fn(() => mockNativeModuleSubscription),
  },

  MLRNShapeSourceModule: {},

  MLRNVectorSourceModule: {
    querySourceFeatures: jest.fn(() => Promise.resolve([])),
  },

  MLRNSnapshotModule: {
    takeSnap: () => {
      return Promise.resolve("file://test.png");
    },
  },
};

jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => {
  const TurboModuleRegistry = jest.requireActual(
    "react-native/Libraries/TurboModule/TurboModuleRegistry",
  );

  return {
    ...TurboModuleRegistry,
    getEnforcing: (name: string) => {
      return mockNativeModules[name] ?? TurboModuleRegistry.getEnforcing(name);
    },
  };
});
