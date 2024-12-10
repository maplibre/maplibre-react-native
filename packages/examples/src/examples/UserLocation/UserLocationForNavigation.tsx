import MapLibreGL, {
  UserLocationRenderMode,
  UserTrackingMode,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Button } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";
import { OSM_RASTER_STYLE } from "../../constants/OSM_RASTER_STYLE";
import { sheet } from "../../styles/sheet";

export default function UserLocationForNavigation() {
  const [navigationActive, setNavigationActive] = useState(false);

  return (
    <>
      <Button
        title={`Navigation is ${navigationActive ? "active" : "inactive"}`}
        onPress={() => setNavigationActive((prevState) => !prevState)}
      />

      <MapLibreGL.MapView
        style={sheet.matchParent}
        styleJSON={JSON.stringify(OSM_RASTER_STYLE)}
        contentInset={navigationActive ? [200, 0, 0, 0] : undefined}
        pitchEnabled={navigationActive}
      >
        {navigationActive ? (
          <MapLibreGL.UserLocation
            renderMode={
              navigationActive
                ? UserLocationRenderMode.Normal
                : UserLocationRenderMode.Native
            }
            showsUserHeadingIndicator
          >
            <MapLibreGL.SymbolLayer
              id="navigation-icon"
              style={{
                iconImage: maplibreIcon,
                iconPitchAlignment: "map",
                iconAllowOverlap: true,
              }}
            />
          </MapLibreGL.UserLocation>
        ) : null}

        <MapLibreGL.Camera
          followUserLocation={navigationActive}
          followUserMode={
            navigationActive
              ? UserTrackingMode.FollowWithHeading
              : UserTrackingMode.Follow
          }
          followZoomLevel={19}
          followPitch={60}
          pitch={0}
          onUserTrackingModeChange={(event) => {
            console.log("js userTrackingModeChange");
            console.log("js", event.type);
            console.log("js", JSON.stringify(event.nativeEvent));

            if (
              navigationActive &&
              !event.nativeEvent.payload.followUserLocation
            ) {
              setNavigationActive(false);
            }
          }}
        />
      </MapLibreGL.MapView>
    </>
  );
}
