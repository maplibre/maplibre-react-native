import {
  Camera,
  CircleLayer,
  MapView,
  UserLocation,
  UserLocationRenderMode,
} from "@maplibre/maplibre-react-native";
import { type ReactNode, useState } from "react";
import { Button, Platform, Text, View } from "react-native";

import { ButtonGroup } from "../../components/ButtonGroup";
import { MapSafeAreaView } from "../../components/MapSafeAreaView";
import { OSM_RASTER_STYLE } from "../../constants/OSM_RASTER_STYLE";

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

const TRACK_USER_LOCATION_OPTIONS = ["default", "heading", "course"] as const;

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
  const [trackUserLocation, setTrackUserLocation] = useState<
    "default" | "heading" | "course" | undefined
  >(undefined);
  const [showsUserHeadingIndicator, setShowsUserHeadingIndicator] =
    useState(false);
  const [androidRenderMode, setAndroidRenderMode] = useState<
    "normal" | "compass" | "gps"
  >("normal");

  return (
    <MapSafeAreaView>
      <Button
        title={
          trackUserLocation
            ? "Don't follow User Location"
            : "Follow user location"
        }
        onPress={() =>
          setTrackUserLocation((prevState) =>
            prevState ? undefined : "default",
          )
        }
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
          options={TRACK_USER_LOCATION_OPTIONS}
          value={
            trackUserLocation
              ? TRACK_USER_LOCATION_OPTIONS.indexOf(trackUserLocation)
              : undefined
          }
          onPress={(index) => {
            setTrackUserLocation(TRACK_USER_LOCATION_OPTIONS[index]!);
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

      <MapView mapStyle={OSM_RASTER_STYLE}>
        <Camera
          trackUserLocation={trackUserLocation}
          zoom={14}
          initialViewState={{ longitude: 10, latitude: 50, zoom: 2 }}
          onTrackUserLocationChange={(event) => {
            console.log(JSON.stringify(event.nativeEvent));

            if (!event.nativeEvent.trackUserLocation) {
              setTrackUserLocation(undefined);
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
