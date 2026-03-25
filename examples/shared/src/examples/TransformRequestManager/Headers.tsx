import { Map, TransformRequestManager } from "@maplibre/maplibre-react-native";
import { useLayoutEffect } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Headers() {
  useLayoutEffect(() => {
    // Add header to all requests
    TransformRequestManager.addHeader(
      "X-All-Request",
      "will-be-added-to-all-requests",
    );

    // Add header only to requests matching a regex pattern (string format)
    TransformRequestManager.addHeader(
      "X-Style-Only",
      "will-only-be-added-to-style-requests",
      "https://demotiles.maplibre.org/style.json",
    );

    // Add header only to requests matching a regex pattern (RegExp object)
    TransformRequestManager.addHeader(
      "X-Tile-Only",
      "will-only-be-added-to-tile-requests",
      /https:\/\/demotiles\.maplibre\.org\/tiles\//,
    );

    return () => {
      TransformRequestManager.removeHeader("X-All-Request");
      TransformRequestManager.removeHeader("X-Style-Only");
      TransformRequestManager.removeHeader("X-Tile-Only");
    };
  }, []);

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE} />

      <Bubble>
        <Text>Inspect network traffic to observe HTTP headers.</Text>
      </Bubble>
    </>
  );
}
