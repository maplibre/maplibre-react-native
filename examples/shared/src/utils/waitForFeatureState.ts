import { equals } from "@jest/expect-utils";
import type { FeatureState } from "@maplibre/maplibre-react-native";

/**
 * Feature state removals are applied on the next rendered map frame, which can
 * lag behind on slow devices. Polls until the state matches `expected` or the
 * timeout passes and returns the last read state either way.
 */
export async function waitForFeatureState(
  getState: () => Promise<FeatureState | null>,
  expected: FeatureState | null,
  timeoutMs = 5000,
): Promise<FeatureState | null> {
  const deadline = Date.now() + timeoutMs;
  let state = await getState();

  while (!equals(state, expected) && Date.now() < deadline) {
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    state = await getState();
  }

  return state;
}
