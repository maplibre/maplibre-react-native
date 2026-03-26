import { Map, TransformRequestManager } from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

/**
 * URL transform pipeline example.
 *
 * This approach can be used for all resource requests and is not limited to the `mapStyle`.
 *
 * The map is given a completely fake URL. Three chained transforms convert it
 * to the real demotiles style URL, exercising every feature of the API:
 *
 *   http://demo-tiles.fake.dev/v1/style.json          (fake input)
 *     → https://demo-tiles.fake.dev/v1/style.json     (step 1: protocol upgrade)
 *     → https://demotiles.maplibre.org/v1/style.json  (step 2: domain swap)
 *     → https://demotiles.maplibre.org/style.json     (step 3: strip /v1 with $1/$2)
 */
const FAKE_STYLE_URL = "http://demo-tiles.fake.dev/v1/style.json";

export function TransformUrl() {
  useEffect(() => {
    // Step 1 — upgrade protocol (no match guard needed, find is specific enough)
    TransformRequestManager.addUrlTransform({
      id: "force-https",
      find: "^http://",
      replace: "https://",
    });

    // Step 2 — swap the fake domain for the real one
    TransformRequestManager.addUrlTransform({
      id: "fix-domain",
      find: "demo-tiles\\.fake\\.dev",
      replace: "demotiles.maplibre.org",
    });

    // Step 3 — strip the /v1 version prefix using capture groups $1 and $2.
    // match guard ensures this only fires after the domain is already correct.
    // input:  https://demotiles.maplibre.org/v1/style.json
    // output: https://demotiles.maplibre.org/style.json
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

  return <Map style={styles.map} mapStyle={FAKE_STYLE_URL} />;
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
