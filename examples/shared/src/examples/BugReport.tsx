import { MapView } from "@maplibre/maplibre-react-native";

export function BugReport() {
  return (
    <MapView
      onPress={(event) => {
        event.persist();

        console.log(event.nativeEvent);
      }}
    >
      {/*
         Reproduce your Bug here
      */}
    </MapView>
  );
}
