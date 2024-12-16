import {
  Camera,
  locationManager,
  MapView,
  UserLocation,
  UserTrackingMode,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import TabBarView from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

const OPTIONS = [0, 5, 10].map((data) => ({ label: data + " Meter", data }));

export default function UserLocationDisplacement() {
  const [minDisplacement, setMinDisplacement] = useState(OPTIONS[0]!.data);

  useEffect(() => {
    locationManager.start();

    return () => {
      locationManager.stop();
    };
  }, []);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setMinDisplacement(data);
      }}
    >
      <MapView style={sheet.matchParent}>
        <Camera
          followUserLocation
          followUserMode={UserTrackingMode.FollowWithHeading}
          followZoomLevel={16}
        />

        <UserLocation minDisplacement={minDisplacement} />
      </MapView>
    </TabBarView>
  );
}
