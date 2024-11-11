import { NativeModules } from "react-native";

import { CameraMode } from "./types/CameraMode";

interface IMLNModule {
  CameraModes: {
    Flight: CameraMode.Flight;
    Ease: CameraMode.Ease;
    Linear: CameraMode.Linear;
    None: CameraMode.None;
  };
  StyleURL: {
    Default: URL;
  };
  OfflinePackDownloadState: {
    Inactive: string | number;
    Active: string | number;
    Complete: string | number;
    Unknown?: string | number;
  };
  LineJoin: {
    Bevel: string | number;
    Round: string | number;
    Miter: string | number;
  };
  StyleSource: {
    DefaultSourceID: string;
  };

  setAccessToken(accessToken: string | null): Promise<string | null>;
  getAccessToken(): Promise<string>;
  setConnected(connected: boolean): void;
}

const MLNModule: IMLNModule = Object.create(NativeModules.MLNModule);

export const {
  CameraModes,
  StyleURL,
  OfflinePackDownloadState,
  LineJoin,
  StyleSource,
  setAccessToken,
  getAccessToken,
  setConnected,
} = MLNModule;
