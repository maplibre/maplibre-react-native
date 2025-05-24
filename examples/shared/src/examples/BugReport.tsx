import { MapView, multiply } from "@maplibre/maplibre-react-native";
import { Text } from "react-native";

export function BugReport() {
  return (
    <>
      <Text>{multiply(3, 7)}</Text>
      <MapView style={{ flex: 1 }}>
        {/*
         Reproduce your Bug here
      */}
      </MapView>
    </>
  );
}
