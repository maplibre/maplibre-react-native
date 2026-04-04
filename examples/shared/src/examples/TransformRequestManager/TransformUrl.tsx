import { Map, TransformRequestManager } from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

/**
 * URL transform pipeline example.
 *
 * This approach can be used for all resource requests and is not limited to the
 * `mapStyle` .
 *
 * The map is given a completely fake URL. Three chained transforms convert it
 * to the real demotiles style URL, exercising every feature of the API:
 *
 * - https://demo-tiles.fake.dev/v1/style.json – fake input
 * - → https://demotiles.maplibre.org/v1/style.json – domain swap
 * - → https://demotiles.maplibre.org/style.json – strip /v1 with $1/$2
 */
export function TransformUrl() {
  useEffect(() => {
    // Swap the fake domain for the real one
    // Input:  https://demo-tiles.fake.dev/v1/style.json
    // Output: https://demotiles.maplibre.org/v1/style.json
    TransformRequestManager.addUrlTransform({
      id: "fix-domain",
      find: "(?i)demo-tiles\\.fake\\.dev",
      replace: "demotiles.maplibre.org",
    });

    // Strip the /v1 version prefix using capture groups $1 and $2.
    // match guard ensures this only fires after the domain is already correct.
    // Input:  https://demotiles.maplibre.org/v1/style.json
    // Output: https://demotiles.maplibre.org/style.json
    TransformRequestManager.addUrlTransform({
      id: "strip-version",
      match: /demotiles\.maplibre\.org/,
      find: "(https://demotiles\\.maplibre\\.org)/v\\d+/(.*)",
      replace: "$1/$2",
    });

    return () => {
      TransformRequestManager.clearUrlTransforms();
    };
  }, []);

  return (
    <Map
      style={styles.map}
      mapStyle="https://DEMO-tiles.fake.dev/v1/style.json"
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
