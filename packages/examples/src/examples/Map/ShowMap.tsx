import MapLibreGL from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import sheet from "../../styles/sheet";
import { onSortOptions } from "../../utils";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = Object.keys(MapLibreGL.StyleURL)
  .map((key) => {
    return {
      label: key,
      data: (MapLibreGL.StyleURL as any)[key], // bad any, because enums
    };
  })
  .sort(onSortOptions);

export default function ShowMap() {
  const [styleURL, setStyleURL] = useState(OPTIONS[0]!.data);

  useEffect(() => {
    MapLibreGL.locationManager.start();

    return (): void => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  return (
    <TabBarPage
      scrollable
      options={OPTIONS}
      onOptionPress={(_index, data): void => {
        setStyleURL(data);
      }}
    >
      <MapLibreGL.MapView styleURL={styleURL} style={sheet.matchParent}>
        <MapLibreGL.Camera followZoomLevel={6} followUserLocation />

        <MapLibreGL.UserLocation
          onPress={() => {
            Alert.alert("You pressed on the user location annotation");
          }}
        />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
