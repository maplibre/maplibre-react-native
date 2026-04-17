import {
  Camera,
  type CameraProps,
  type CameraRef,
  Map,
  type ViewPadding,
} from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  EU_BOUNDS,
  EU_CENTER_COORDINATES,
  US_BOUNDS,
  US_CENTER_COORDINATES,
} from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const PADDING_NONE: ViewPadding = { top: 0, right: 0, bottom: 0, left: 0 };
const PADDING_TOP: ViewPadding = { top: 200, right: 40, bottom: 40, left: 40 };
const PADDING_BOTTOM: ViewPadding = {
  top: 40,
  right: 40,
  bottom: 200,
  left: 40,
};
const getPadding = (padding: "top" | "bottom" | undefined): ViewPadding => {
  if (padding === "top") {
    return PADDING_TOP;
  }
  if (padding === "bottom") {
    return PADDING_BOTTOM;
  }

  return PADDING_NONE;
};

type LocationType =
  | "usCenter"
  | "usBounds"
  | "euCenter"
  | "euBounds"
  | undefined;

type CachedFlyTo = "us" | "eu" | undefined;

interface SectionButton {
  title: string;
  selected: boolean;
  onPress: () => void;
}

interface SectionProps {
  title: string;
  buttons: SectionButton[];
  fade?: boolean;
}

function Section({ title, buttons, fade = false }: SectionProps) {
  return (
    <View style={{ paddingBottom: 5, opacity: fade ? 0.5 : 1 }}>
      <Text>{title}</Text>
      <ScrollView
        horizontal
        style={{
          flex: 0,
          flexDirection: "row",
          width: "100%",
          paddingVertical: 10,
        }}
      >
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.title}
            style={{
              flex: 0,
              padding: 5,
              marginRight: 5,
              backgroundColor: button.selected ? "coral" : "#d8d8d8",
              borderRadius: 5,
            }}
            onPress={button.onPress}
          >
            <Text>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function Fit() {
  const [locationType, setLocationType] = useState<LocationType>("usCenter");
  const [zoom, setZoom] = useState<number | undefined>(4);
  const [trackUserLocation, setTrackUserLocation] = useState(false);
  const [padding, setPadding] = useState<"top" | "bottom">();

  const [cachedFlyTo, setCachedFlyTo] = useState<CachedFlyTo>();
  const [cachedZoomLevel, setCachedZoomLevel] = useState<number>();

  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    if (trackUserLocation) {
      setLocationType(undefined);
      setCachedFlyTo(undefined);
      setCachedZoomLevel(undefined);
    }
  }, [trackUserLocation]);

  useEffect(() => {
    if (locationType) {
      setTrackUserLocation(false);
    }
  }, [locationType]);

  useEffect(() => {
    setCachedFlyTo(undefined);
    setCachedZoomLevel(undefined);
  }, [locationType, zoom, padding]);

  useEffect(() => {
    setLocationType(undefined);
    setZoom(undefined);
    setPadding(undefined);
  }, [cachedFlyTo, cachedZoomLevel]);

  const cameraProps = useMemo<CameraProps>(() => {
    const p: CameraProps = {
      zoom,
      padding: getPadding(padding),
      trackUserLocation: trackUserLocation ? "default" : undefined,
      duration: 500,
      easing: "ease",
    };

    if (!trackUserLocation) {
      if (locationType === "usCenter") {
        return {
          ...p,
          center: US_CENTER_COORDINATES,
        };
      } else if (locationType === "usBounds") {
        return { ...p, bounds: US_BOUNDS };
      } else if (locationType === "euCenter") {
        return {
          ...p,
          center: EU_CENTER_COORDINATES,
        };
      } else if (locationType === "euBounds") {
        return { ...p, bounds: EU_BOUNDS };
      }
    }

    return p;
  }, [locationType, zoom, trackUserLocation, padding]);

  console.log(cameraProps);

  const locationTypeButtons = [
    ["US (center)", "usCenter"],
    ["US (bounds)", "usBounds"],
    ["EU (center)", "euCenter"],
    ["EU (bounds)", "euBounds"],
    ["Uncontrolled", undefined],
  ].map((o) => ({
    title: `${o[0]}`,
    selected: locationType === o[1],
    onPress: () => setLocationType(o[1] as LocationType),
  }));

  const zoomConfigButtons = [2, 4, 8, 12, 16, 20, undefined].map((n) => ({
    title: n ? `${n}` : "Uncontrolled",
    selected: zoom === n,
    onPress: () => setZoom(n),
  }));

  const zoomToButtons = [14, 15, 16, 17, 18, 19, 20].map((zoom) => ({
    title: `${zoom}`,
    selected: cachedZoomLevel === zoom,
    onPress: () => {
      cameraRef.current?.zoomTo(zoom);
      setCachedZoomLevel(zoom);
    },
  }));

  return (
    <>
      <Map
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onRegionDidChange={() => {
          setCachedFlyTo(undefined);
          setCachedZoomLevel(undefined);
        }}
      >
        <Camera
          ref={cameraRef}
          {...cameraProps}
          onTrackUserLocationChange={(event) => {
            if (!event.nativeEvent.trackUserLocation) {
              setTrackUserLocation(false);
            }
          }}
        />

        <View
          style={{
            pointerEvents: "none",
            flex: 1,
            paddingTop: getPadding(padding).top,
            paddingRight: getPadding(padding).right,
            paddingBottom: getPadding(padding).bottom,
            paddingLeft: getPadding(padding).left,
          }}
        >
          <View
            style={{
              flex: 1,
              borderColor: "red",
              borderWidth: 4,
            }}
          />
        </View>
      </Map>
      <ScrollView
        style={{
          flex: 0,
          width: "100%",
          maxHeight: 350,
          backgroundColor: "white",
        }}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 20,
        }}
      >
        <Section title="Region" buttons={locationTypeButtons} />
        <Section
          title={
            "Zoom" +
            ("bounds" in cameraProps ? " (only used if center is set)" : "")
          }
          buttons={zoomConfigButtons}
          fade={"bounds" in cameraProps}
        />
        <Section
          title="Follow user location"
          buttons={[
            {
              title: trackUserLocation ? "Enabled" : "Disabled",
              selected: trackUserLocation,
              onPress: () => setTrackUserLocation(!trackUserLocation),
            },
          ]}
        />
        <Section
          title="Fly to (imperative)"
          buttons={[
            {
              title: "US",
              selected: cachedFlyTo === "us",
              onPress: () => {
                cameraRef.current?.flyTo({
                  center: US_CENTER_COORDINATES,
                });
                setCachedFlyTo("us");
              },
            },
            {
              title: "EU",
              selected: cachedFlyTo === "eu",
              onPress: () => {
                cameraRef.current?.flyTo({
                  center: EU_CENTER_COORDINATES,
                });
                setCachedFlyTo("eu");
              },
            },
          ]}
        />
        <Section title="Zoom to (imperative)" buttons={zoomToButtons} />
        <Section
          title="Padding"
          buttons={[
            {
              title: "None",
              selected: !padding,
              onPress: () => setPadding(undefined),
            },
            {
              title: "Top",
              selected: padding === "top",
              onPress: () => setPadding("top"),
            },
            {
              title: "Bottom",
              selected: padding === "bottom",
              onPress: () => setPadding("bottom"),
            },
          ]}
        />
      </ScrollView>
    </>
  );
}
