import {
  Camera,
  Map,
  Layer,
  UserLocation,
  Images,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Button } from "react-native";

import maplibreIcon from "@/assets/images/maplibre.png";
import { OSM_VECTOR_STYLE } from "@/constants/OSM_VECTOR_STYLE";

export function UserLocationForNavigation() {
  const [navigationActive, setNavigationActive] = useState(false);

  return (
    <>
      <Button
        title={`Navigation is ${navigationActive ? "active" : "inactive"}`}
        onPress={() => setNavigationActive((prevState) => !prevState)}
      />

      <Map
        mapStyle={OSM_VECTOR_STYLE}
        contentInset={navigationActive ? { top: 200 } : undefined}
        touchPitch={navigationActive}
      >
        <Images images={{ "maplibre-icon": maplibreIcon }} />

        {navigationActive ? (
          <UserLocation heading>
            <Layer
              type="symbol"
              id="navigation-icon"
              layout={{
                "icon-image": "maplibre-icon",
                "icon-pitch-alignment": "map",
                "icon-allow-overlap": true,
              }}
            />
          </UserLocation>
        ) : null}

        <Camera
          trackUserLocation={navigationActive ? "heading" : undefined}
          zoom={navigationActive ? 19 : undefined}
          pitch={navigationActive ? 60 : undefined}
          onTrackUserLocationChange={(event) => {
            if (navigationActive && !event.nativeEvent.trackUserLocation) {
              setNavigationActive(false);
            }
          }}
        />
      </Map>
    </>
  );
}
