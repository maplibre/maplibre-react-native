import {
  Camera,
  Layer,
  Map,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { type ReactNode, useState } from "react";
import { Button, Text, View } from "react-native";

import { ButtonGroup } from "@/components/ButtonGroup";
import { MapSafeAreaView } from "@/components/MapSafeAreaView";
import { OSM_VECTOR_STYLE } from "@/constants/OSM_VECTOR_STYLE";

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

type ExampleRenderMode = "default" | "children";

const EXAMPLE_RENDER_MODES: ExampleRenderMode[] = ["default", "children"];

export function FollowUserLocationRenderMode() {
  const [renderMode, setRenderMode] = useState<ExampleRenderMode>("default");
  const [trackUserLocation, setTrackUserLocation] = useState<
    "default" | "heading" | "course" | undefined
  >(undefined);

  const [heading, setHeading] = useState(false);

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
          heading
            ? "Hide user heading indicator"
            : "Show user heading indicator"
        }
        onPress={() => setHeading((prevState) => !prevState)}
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

      <Map mapStyle={OSM_VECTOR_STYLE}>
        <Camera
          trackUserLocation={trackUserLocation}
          zoom={14}
          initialViewState={{ center: [10, 50], zoom: 2 }}
          onTrackUserLocationChange={(event) => {
            console.log(JSON.stringify(event.nativeEvent));

            if (!event.nativeEvent.trackUserLocation) {
              setTrackUserLocation(undefined);
            }
          }}
        />

        <UserLocation heading={heading}>
          {renderMode === "children"
            ? [
                <Layer
                  type="circle"
                  key="customer-user-location-children-red"
                  id="customer-user-location-children-red"
                  style={{ circleColor: "red", circleRadius: 8 }}
                />,
                <Layer
                  type="circle"
                  key="customer-user-location-children-white"
                  id="customer-user-location-children-white"
                  style={{ circleColor: "white", circleRadius: 4 }}
                />,
              ]
            : undefined}
        </UserLocation>
      </Map>

      <ButtonGroup
        value={EXAMPLE_RENDER_MODES.indexOf(renderMode)}
        options={EXAMPLE_RENDER_MODES.map(humanize)}
        onPress={(index: number) => {
          setRenderMode(EXAMPLE_RENDER_MODES[index]!);
        }}
      />
    </MapSafeAreaView>
  );
}
