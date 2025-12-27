import { NativeModules } from "react-native";

interface IMLRNModule {
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
  StyleSource,
  StyleURL,

  addCustomHeader,
  removeCustomHeader,

  setConnected,
} = MLRNModule;
