import type { NativeSyntheticEvent } from "react-native";

import type { PressEventWithFeatures } from "../PressEventWithFeatures";
import type { ViewPadding } from "../ViewPadding";

export interface PressableSource {
  /**
   * Source press listener, gets called when a user presses one of the children layers only if that layer has a higher z-index than another source layers.
   */
  onPress?: (event: NativeSyntheticEvent<PressEventWithFeatures>) => void;

  /**
   * Overrides the default touch hitbox (44 x 44 pixels) for the source layers
   */
  hitbox?: ViewPadding;
}
