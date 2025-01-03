type VersionString =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`;

export type MapLibrePluginProps =
  | {
      /**
       * Properties relevant only for Android
       *
       * @platform android
       */
      android?: {
        /**
         * Version for org.maplibre.gl:android-sdk
         */
        nativeVersion?: VersionString;
        /**
         * Version for org.maplibre.gl:android-plugin-*-v9
         */
        pluginVersion?: VersionString;
        /**
         * Version for org.maplibre.gl:android-sdk-turf
         */
        turfVersion?: VersionString;
        /**
         * Version for com.squareup.okhttp3:okhttp
         */
        okhttpVersion?: VersionString;

        /**
         * Location engine to be used
         *
         * - `default`: Used per default from MapLibre; F-Droid compatible
         * - `google`: Google Play Services Location Engine for higher precision; F-Droid incompatible
         */
        locationEngine?: "default" | "google";
        /**
         * Version for com.google.android.gms:play-services-location, only used with `locationEngine: "google"`
         */
        googlePlayServicesLocationVersion?: VersionString;
      };
    }
  | undefined;
