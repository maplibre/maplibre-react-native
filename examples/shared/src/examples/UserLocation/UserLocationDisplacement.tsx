import {
  Camera,
  LocationManager,
  MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import { TabBarView } from "@/components/TabBarView";

const OPTIONS = [0, 5, 10].map((data) => ({ label: data + " Meter", data }));

export function UserLocationDisplacement() {
  const [minDisplacement, setMinDisplacement] = useState(OPTIONS[0]!.data);

  useEffect(() => {
    LocationManager.start();

    return () => {
      LocationManager.stop();
    };
  }, []);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setMinDisplacement(data);
      }}
    >
      <MapView>
        <Camera trackUserLocation="heading" zoom={16} />

        <UserLocation minDisplacement={minDisplacement} />
      </MapView>
    </TabBarView>
  );
}
