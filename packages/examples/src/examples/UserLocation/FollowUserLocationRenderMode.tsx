import MapLibreGL, {
  UserLocationRenderMode,
  UserTrackingMode,
} from "@maplibre/maplibre-react-native";
import { ButtonGroup } from "@rneui/themed";
import React, { ReactNode, useState } from "react";
import { Button, Platform, SafeAreaView, Text, View } from "react-native";

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

const styles = { matchParent: { flex: 1 } };

function humanize(name: string): string {
  const words = name.match(/[A-Za-z][a-z]*/g) || [];

  return words.map((i) => i.charAt(0).toUpperCase() + i.substring(1)).join(" ");
}

enum ExampleRenderMode {
  Normal = "normal",
  Native = "native",
  CustomChildren = "customChildren",
  Hidden = "hidden",
}

const ANDROID_RENDER_MODES: ("normal" | "compass" | "gps")[] = [
  "normal",
  "compass",
  "gps",
];

export default function FollowUserLocationRenderMode() {
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
    <SafeAreaView style={styles.matchParent}>
      <View>
        <Button
          title={
            followUserLocation
              ? "Don`t follow User Location"
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
          onPress={() =>
            setShowsUserHeadingIndicator((prevState) => !prevState)
          }
        />

        <SettingsGroup label="Follow User Mode">
          <ButtonGroup
            buttons={Object.values(UserTrackingMode)}
            selectedIndex={Object.values(UserTrackingMode).indexOf(
              followUserMode,
            )}
            onPress={(index) => {
              setFollowUserMode(Object.values(UserTrackingMode)[index]);
            }}
            activeOpacity={1}
          />
        </SettingsGroup>

        {Platform.OS === "android" && (
          <SettingsGroup label="Android Render Mode">
            <ButtonGroup
              disabled={renderMode !== ExampleRenderMode.Native}
              buttons={ANDROID_RENDER_MODES}
              selectedIndex={ANDROID_RENDER_MODES.indexOf(androidRenderMode)}
              onPress={(index) => {
                setAndroidRenderMode(ANDROID_RENDER_MODES[index]);
              }}
              activeOpacity={1}
            />
          </SettingsGroup>
        )}
      </View>

      <MapLibreGL.MapView style={styles.matchParent} tintColor="red">
        <MapLibreGL.Camera
          // defaultSettings={{
          //   centerCoordinate: DEFAULT_CENTER_COORDINATE,
          //   zoomLevel: 18,
          // }}
          followUserLocation={followUserLocation}
          followUserMode={followUserMode}
          followZoomLevel={18}
          onUserTrackingModeChange={(event) => {
            if (!event.nativeEvent.payload.followUserLocation) {
              setFollowUserLocation(false);
            }
          }}
        />
        <MapLibreGL.UserLocation
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
                <MapLibreGL.CircleLayer
                  key="customer-user-location-children-red"
                  id="customer-user-location-children-red"
                  style={{ circleColor: "red", circleRadius: 8 }}
                />,
                <MapLibreGL.CircleLayer
                  key="customer-user-location-children-white"
                  id="customer-user-location-children-white"
                  style={{ circleColor: "white", circleRadius: 4 }}
                />,
              ]
            : undefined}
        </MapLibreGL.UserLocation>
      </MapLibreGL.MapView>

      <ButtonGroup
        buttons={Object.values(ExampleRenderMode).map(humanize)}
        selectedIndex={Object.values(ExampleRenderMode).indexOf(renderMode)}
        onPress={(index) => {
          setRenderMode(Object.values(ExampleRenderMode)[index]);
        }}
        activeOpacity={1}
      />
    </SafeAreaView>
  );
}
