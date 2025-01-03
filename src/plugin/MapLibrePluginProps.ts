export type MapLibrePluginProps =
  | {
      android?: {
        locationEngine?: "default" | "google";
      };
    }
  | undefined;
