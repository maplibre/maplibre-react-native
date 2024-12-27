import "@testing-library/react-native/extend-expect";
import { NativeModules } from "react-native";

function keyMirror(keys: string[]) {
  const obj: Record<string, string> = {};
  keys.forEach((key) => (obj[key] = key));
  return obj;
}

// Mock of what the native code puts on the JS object
NativeModules.MLRNModule = {
  // constants
  UserTrackingMode: keyMirror([
    "None",
    "Follow",
    "FollowWithCourse",
    "FollowWithHeading",
  ]),
  StyleURL: keyMirror(["Default"]),
  EventTypes: keyMirror([
    "MapClick",
    "MapLongClick",
    "RegionWillChange",
    "RegionIsChanging",
    "RegionDidChange",
    "WillStartLoadingMap",
    "DidFinishLoadingMap",
    "DidFailLoadingMap",
    "WillStartRenderingFrame",
    "DidFinishRenderingFrame",
    "DidFinishRenderingFrameFully",
    "DidFinishLoadingStyle",
    "SetCameraComplete",
  ]),
  CameraModes: keyMirror(["Flight", "Ease", "None"]),
  StyleSource: keyMirror(["DefaultSourceID"]),
  OfflinePackDownloadState: keyMirror(["Inactive", "Active", "Complete"]),
  OfflineCallbackName: keyMirror(["Progress", "Error"]),

  // Methods
  setAccessToken: jest.fn(),
  getAccessToken: () => Promise.resolve("test-token"),

  addCustomHeader: jest.fn(),
  removeCustomHeader: jest.fn(),

  setConnected: jest.fn(),
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

NativeModules.MLRNSnapshotModule = {
  takeSnap: () => {
    return Promise.resolve("file://test.png");
  },
};

NativeModules.MLRNLocationModule = {
  getLastKnownLocation: jest.fn(),
  setMinDisplacement: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
};
