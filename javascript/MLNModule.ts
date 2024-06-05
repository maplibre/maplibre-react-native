import {NativeModules} from 'react-native';

interface IMLNModule {
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

const MLNModule: IMLNModule = {...NativeModules.MLNModule};

export const {
  StyleURL,
  OfflinePackDownloadState,
  LineJoin,
  StyleSource,
  setAccessToken,
  getAccessToken,
  setConnected,
} = MLNModule;
