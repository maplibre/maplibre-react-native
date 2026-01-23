import {
  Camera,
  type CameraRef,
  MapView,
  type MapViewRef,
  type ViewStateChangeEvent,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text, View } from "react-native";

import { Bubble } from "@/components/Bubble";
import { TabBarView } from "@/components/TabBarView";
import { EU_BOUNDS, US_BOUNDS } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ShowRegionDidChange() {
  const mapViewRef = useRef<MapViewRef>(null);
  const cameraRef = useRef<CameraRef>(null);

  const [reason, setReason] = useState<string>();
  const [viewStateChangeEvent, setViewStateChangeEvent] =
    useState<ViewStateChangeEvent>();

  console.log(reason);
  console.log(viewStateChangeEvent);

  return (
    <TabBarView
      options={[
        { label: "Fit Bounds EU", data: EU_BOUNDS },
        { label: "Fit Bounds US", data: US_BOUNDS },
      ]}
      onOptionPress={(_, data) => {
        cameraRef?.current?.fitBounds(data);
      }}
    >
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapViewRef}
          mapStyle={MAPLIBRE_DEMO_STYLE}
          onRegionWillChange={(event) => {
            event.persist();
            setReason("Will Change");
            setViewStateChangeEvent(event.nativeEvent);
          }}
          onRegionIsChanging={(event) => {
            event.persist();
            setReason("Is Changing");
            setViewStateChangeEvent(event.nativeEvent);
          }}
          onRegionDidChange={(event) => {
            event.persist();
            setReason("Did Change");
            setViewStateChangeEvent(event.nativeEvent);
          }}
        >
          <Camera ref={cameraRef} />
        </MapView>

        <Bubble>
          {!viewStateChangeEvent ||
          (viewStateChangeEvent.center[0] === 0 &&
            viewStateChangeEvent.center[1] === 0) ? (
            <Text>Move the map!</Text>
          ) : (
            <>
              <Text>{reason}</Text>
              <Text>Longitude: {viewStateChangeEvent.center[0]}</Text>
              <Text>Latitude: {viewStateChangeEvent.center[1]}</Text>
              <Text>Visible Bounds: {viewStateChangeEvent.bounds}</Text>
              <Text>Zoom Level: {viewStateChangeEvent.zoom}</Text>
              <Text>Heading: {viewStateChangeEvent.bearing}</Text>
              <Text>Pitch: {viewStateChangeEvent.pitch}</Text>
              <Text>
                Is User Interaction:{" "}
                {viewStateChangeEvent.userInteraction ? "true" : "false"}
              </Text>
              <Text>
                Animated: {viewStateChangeEvent.animated ? "true" : "false"}
              </Text>
            </>
          )}
        </Bubble>
      </View>
    </TabBarView>
  );
}
