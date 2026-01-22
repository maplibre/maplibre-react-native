import { MapView, RequestManager } from "@maplibre/maplibre-react-native";
import { useLayoutEffect } from "react";

export function RequestHTTPHeaders() {
  useLayoutEffect(() => {
    RequestManager.addHeader("x-dynamic-example", "eXamPlE-vAluE");

    return () => {
      RequestManager.removeHeader("x-dynamic-example");
    };
  }, []);

  return <MapView />;
}
