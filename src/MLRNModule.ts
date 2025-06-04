import { NativeModules } from "react-native";

import { CameraMode } from "./types/CameraMode";

interface IMLRNModule {
  CameraModes: {
    Flight: CameraMode.Flight;
    Ease: CameraMode.Ease;
    Linear: CameraMode.Linear;
    None: CameraMode.None;
  };

  OfflinePackDownloadState: {
    Inactive: string | number;
    Active: string | number;
    Complete: string | number;
    Unknown?: string | number;
  };

  StyleSource: {
    DefaultSourceID: string;
  };

  StyleURL: {
    Default: string;
  };

  addCustomHeader(headerName: string, headerValue: string): void;
  removeCustomHeader(headerName: string): void;

  setConnected(connected: boolean): void;
}

const MLRNModule: IMLRNModule = Object.create(NativeModules.MLRNModule);

export const {
  CameraModes,
  OfflinePackDownloadState,
  StyleSource,
  StyleURL,

  addCustomHeader,
  removeCustomHeader,

  setConnected,
} = MLRNModule;
