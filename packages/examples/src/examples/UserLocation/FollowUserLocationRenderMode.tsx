import {
  Camera,
  CircleLayer,
  MapView,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from "@maplibre/maplibre-react-native";
import { type ReactNode, useState } from "react";
import { Button, Platform, Text, View } from "react-native";

import { ButtonGroup } from "../../components/ButtonGroup";
import { MapSafeAreaView } from "../../components/MapSafeAreaView";
import { OSM_RASTER_STYLE } from "../../constants/OSM_RASTER_STYLE";
import { sheet } from "../../styles/sheet";

const SettingsGroup = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => (
  <View>
    <Text style={{ textAlign: "center", fontWeight: "bold" }}>{label}</Text>
    {children}
  </View>
);

function humanize(name: string): string {
  const words = name.match(/[A-Za-z][a-z]*/g) || [];

  return words.map((i) => i.charAt(0).toUpperCase() + i.substring(1)).join(" ");
}

enum ExampleRenderMode {
  Normal = "normal",
  CustomChildren = "customChildren",
  Native = "native",
  Hidden = "hidden",
}

const ANDROID_RENDER_MODES: ("normal" | "compass" | "gps")[] = [
  "normal",
  "compass",
  "gps",
];

export function FollowUserLocationRenderMode() {
  const [renderMode, setRenderMode] = useState<ExampleRenderMode>(
    ExampleRenderMode.Normal,
  );
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [followUserMode, setFollowUserMode] = useState(UserTrackingMode.Follow);
  const [showsUserHeadingIndicator, setShowsUserHeadingIndicator] =
    useState(false);
  const [androidRenderMode, setAndroidRenderMode] = useState<
    "normal" | "compass" | "gps"
  >("normal");

  return (
    <MapSafeAreaView>
      <Button
        title={
          followUserLocation
            ? "Don't follow User Location"
            : "Follow user location"
        }
        onPress={() => setFollowUserLocation((prevState) => !prevState)}
      />
      <Button
        title={
          showsUserHeadingIndicator
            ? "Hide user heading indicator"
            : "Show user heading indicator"
        }
        onPress={() => setShowsUserHeadingIndicator((prevState) => !prevState)}
      />

      <SettingsGroup label="Follow User Mode">
        <ButtonGroup
          options={Object.values(UserTrackingMode)}
          value={Object.values(UserTrackingMode).indexOf(followUserMode)}
          onPress={(index) => {
            setFollowUserMode(Object.values(UserTrackingMode)[index]!);
          }}
        />
      </SettingsGroup>

      {Platform.OS === "android" && (
        <SettingsGroup label="Android Render Mode">
          <ButtonGroup
            disabled={renderMode !== ExampleRenderMode.Native}
            options={ANDROID_RENDER_MODES}
            value={ANDROID_RENDER_MODES.indexOf(androidRenderMode)}
            onPress={(index) => {
              setAndroidRenderMode(ANDROID_RENDER_MODES[index]!);
            }}
          />
        </SettingsGroup>
      )}

      <MapView style={sheet.matchParent} mapStyle={OSM_RASTER_STYLE}>
        <Camera
          followUserLocation={followUserLocation}
          followUserMode={followUserMode}
          followZoomLevel={14}
          defaultSettings={{ centerCoordinate: [10, 50], zoomLevel: 2 }}
          onUserTrackingModeChange={(event) => {
            console.log(JSON.stringify(event.nativeEvent.payload));

            if (!event.nativeEvent.payload.followUserLocation) {
              setFollowUserLocation(false);
            }
          }}
        />

        <UserLocation
          visible={renderMode !== ExampleRenderMode.Hidden}
          renderMode={
            renderMode === ExampleRenderMode.Native
              ? UserLocationRenderMode.Native
              : UserLocationRenderMode.Normal
          }
          showsUserHeadingIndicator={showsUserHeadingIndicator}
          androidRenderMode={androidRenderMode}
        >
          {renderMode === ExampleRenderMode.CustomChildren
            ? [
                <CircleLayer
                  key="customer-user-location-children-red"
                  id="customer-user-location-children-red"
                  style={{ circleColor: "red", circleRadius: 8 }}
                />,
                <CircleLayer
                  key="customer-user-location-children-white"
                  id="customer-user-location-children-white"
                  style={{ circleColor: "white", circleRadius: 4 }}
                />,
              ]
            : undefined}
        </UserLocation>
      </MapView>

      <ButtonGroup
        value={Object.values(ExampleRenderMode).indexOf(renderMode)}
        options={Object.values(ExampleRenderMode).map(humanize)}
        onPress={(index: number) => {
          setRenderMode(Object.values(ExampleRenderMode)[index]!);
        }}
      />
    </MapSafeAreaView>
  );
}
