import { NativeModules } from "react-native";

interface IMLRNModule {
  OfflinePackDownloadState: {
    Inactive: string | number;
    Active: string | number;
    Complete: string | number;
    Unknown?: string | number;
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
  OfflinePackDownloadState,
  StyleURL,

  addCustomHeader,
  removeCustomHeader,

  setConnected,
} = MLRNModule;
