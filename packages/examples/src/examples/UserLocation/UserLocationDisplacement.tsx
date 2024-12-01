import MapLibreGL from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import TabBarView from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

const OPTIONS = [0, 5, 10].map((data) => ({ label: data + " Meter", data }));

export default function UserLocationDisplacement() {
  const [minDisplacement, setMinDisplacement] = useState(OPTIONS[0]!.data);

  useEffect(() => {
    MapLibreGL.locationManager.start();

    return () => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setMinDisplacement(data);
      }}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera
          followUserLocation
          followUserMode={MapLibreGL.UserTrackingMode.FollowWithHeading}
          followZoomLevel={16}
        />

        <MapLibreGL.UserLocation minDisplacement={minDisplacement} />
      </MapLibreGL.MapView>
    </TabBarView>
  );
}
