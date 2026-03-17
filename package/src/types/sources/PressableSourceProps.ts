import type { NativeSyntheticEvent } from "react-native";

import type { PressEventWithFeatures } from "../PressEventWithFeatures";
import type { ViewPadding } from "../ViewPadding";

export interface PressableSourceProps {
  /**
   * Emits on press when a child `Layer` within the hitbox has highest z-index
   *
   * This bubbles up to Map's onPress unless `event.stopPropagation()` is
   * called.
   */
  onPress?: (event: NativeSyntheticEvent<PressEventWithFeatures>) => void;

  /**
   * Overrides the default touch hitbox (44 x 44 pixels) for the source layers
   */
  hitbox?: ViewPadding;
}
