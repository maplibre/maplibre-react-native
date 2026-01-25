import { MapView, NetworkManager } from "@maplibre/maplibre-react-native";
import { useLayoutEffect } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function NetworkRequestHeaders() {
  useLayoutEffect(() => {
    // Add header to all requests
    NetworkManager.addRequestHeader(
      "X-All-Request",
      "will-be-added-to-all-requests",
    );

    // Add header only to requests matching a regex pattern (string format)
    NetworkManager.addRequestHeader(
      "X-Style-Only",
      "will-only-be-added-to-style-requests",
      "https://demotiles.maplibre.org/style.json",
    );

    // Add header only to requests matching a regex pattern (RegExp object)
    NetworkManager.addRequestHeader(
      "X-Tile-Only",
      "will-only-be-added-to-tile-requests",
      /https:\/\/demotiles\.maplibre\.org\/tiles\//,
    );

    return () => {
      NetworkManager.removeRequestHeader("X-All-Request");
      NetworkManager.removeRequestHeader("X-Style-Only");
      NetworkManager.removeRequestHeader("X-Tile-Only");
    };
  }, []);

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE} />

      <Bubble>
        <Text>Inspect network traffic to observe HTTP headers.</Text>
      </Bubble>
    </>
  );
}
