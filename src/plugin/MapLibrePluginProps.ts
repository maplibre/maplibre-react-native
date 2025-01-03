type VersionString =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`;

export type MapLibrePluginProps =
  | {
      android?: {
        nativeVersion?: VersionString;
        pluginVersion?: VersionString;
        turfVersion?: VersionString;
        okhttpVersion?: VersionString;

        locationEngine?: "default" | "google";
        googlePlayServicesLocationVersion?: VersionString;
      };
    }
  | undefined;
