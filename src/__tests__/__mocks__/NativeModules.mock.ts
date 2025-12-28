import { NativeModules } from "react-native";

function keyMirror(keys: string[]) {
  const obj: Record<string, string> = {};
  keys.forEach((key) => (obj[key] = key));
  return obj;
}

// Mock of what the native code puts on the JS object
// Note: MLRNModule is deprecated and will be removed in a future version.
// Constants have been moved to src/constants.ts
// Methods (addCustomHeader, removeCustomHeader, setConnected) have been moved to RequestManager
NativeModules.MLRNModule = {
  // constants (deprecated - use src/constants.ts instead)
  StyleURL: keyMirror(["Default"]),
  StyleSource: keyMirror(["DefaultSourceID"]),
  OfflinePackDownloadState: keyMirror(["Inactive", "Active", "Complete"]),
  OfflineCallbackName: keyMirror(["Progress", "Error"]),
};

NativeModules.MLRNOfflineModule = {
  createPack: (packOptions: any) => {
    return Promise.resolve({
      bounds: packOptions.bounds,
      metadata: JSON.stringify({ name: packOptions.name }),
    });
  },
  getPacks: () => Promise.resolve([]),
  deletePack: () => Promise.resolve(),
  getPackStatus: () => Promise.resolve({}),
  pausePackDownload: () => Promise.resolve(),
  resumePackDownload: () => Promise.resolve(),
  setPackObserver: () => Promise.resolve(),
  setTileCountLimit: jest.fn(),
  setProgressEventThrottle: jest.fn(),
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

  MLRNRequestModule: {
    addCustomHeader: jest.fn(),
    removeCustomHeader: jest.fn(),
    setConnected: jest.fn(),
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
