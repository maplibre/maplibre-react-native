import { MapView, NetworkManager } from "@maplibre/maplibre-react-native";
import { useLayoutEffect } from "react";

export function RequestHTTPHeaders() {
  useLayoutEffect(() => {
    NetworkManager.addRequestHeader("x-dynamic-example", "eXamPlE-vAluE");

    return () => {
      NetworkManager.removeRequestHeader("x-dynamic-example");
    };
  }, []);

  return <MapView />;
}
