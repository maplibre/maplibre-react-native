import {
  Camera,
  MapView,
  SymbolLayer,
  UserLocation,
  UserLocationRenderMode,
  TrackUserLocationMode,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Button } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";
import { OSM_RASTER_STYLE } from "../../constants/OSM_RASTER_STYLE";
import { sheet } from "../../styles/sheet";

export function UserLocationForNavigation() {
  const [navigationActive, setNavigationActive] = useState(false);

  return (
    <>
      <Button
        title={`Navigation is ${navigationActive ? "active" : "inactive"}`}
        onPress={() => setNavigationActive((prevState) => !prevState)}
      />

      <MapView
        style={sheet.matchParent}
        mapStyle={OSM_RASTER_STYLE}
        contentInset={navigationActive ? { top: 200 } : undefined}
        pitch={navigationActive}
      >
        {navigationActive ? (
          <UserLocation
            renderMode={
              navigationActive
                ? UserLocationRenderMode.Normal
                : UserLocationRenderMode.Native
            }
            showsUserHeadingIndicator
          >
            <SymbolLayer
              id="navigation-icon"
              style={{
                iconImage: maplibreIcon,
                iconPitchAlignment: "map",
                iconAllowOverlap: true,
              }}
            />
          </UserLocation>
        ) : null}

        <Camera
          followUserLocation={navigationActive}
          followUserMode={
            navigationActive
              ? TrackUserLocationMode.FollowWithHeading
              : TrackUserLocationMode.Follow
          }
          followZoom={19}
          followPitch={60}
          pitch={0}
          onUserTrackingModeChange={(event) => {
            if (navigationActive && !event.nativeEvent.followUserLocation) {
              setNavigationActive(false);
            }
          }}
        />
      </MapView>
    </>
  );
}
