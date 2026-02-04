import {
  Callout,
  Camera,
  type InitialViewState,
  type LngLat,
  MapView,
  PointAnnotation,
  type PointAnnotationRef,
} from "@maplibre/maplibre-react-native";
import { type ReactNode, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const ANNOTATION_SIZE = 40;

const styles = StyleSheet.create({
  annotationContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: ANNOTATION_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: ANNOTATION_SIZE,
    justifyContent: "center",
    overflow: "hidden",
    width: ANNOTATION_SIZE,
  },
});

type AnnotationWithRemoteImageProps = {
  id: string;
  title: string;
  lngLat: LngLat;
};

const AnnotationWithRemoteImage = ({
  id,
  lngLat,
  title,
}: AnnotationWithRemoteImageProps) => {
  const pointAnnotation = useRef<PointAnnotationRef>(null);

  return (
    <PointAnnotation
      id={id}
      lngLat={lngLat}
      title={title}
      draggable
      onSelected={(event) =>
        console.log(
          "onSelected:",
          event.nativeEvent.id,
          event.nativeEvent.lngLat,
        )
      }
      onDrag={(event) =>
        console.log("onDrag:", event.nativeEvent.id, event.nativeEvent.lngLat)
      }
      onDragStart={(event) =>
        console.log(
          "onDragStart:",
          event.nativeEvent.id,
          event.nativeEvent.lngLat,
        )
      }
      onDragEnd={(event) =>
        console.log(
          "onDragEnd:",
          event.nativeEvent.id,
          event.nativeEvent.lngLat,
        )
      }
      ref={pointAnnotation}
    >
      <View style={styles.annotationContainer}>
        <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{ width: ANNOTATION_SIZE, height: ANNOTATION_SIZE }}
          onLoad={() => pointAnnotation.current?.refresh()}
          // Prevent rendering bitmap at unknown animation state
          fadeDuration={0}
        />
      </View>
      <Callout title="This is a sample loading a remote image" />
    </PointAnnotation>
  );
};

export function ShowPointAnnotation() {
  const [coordinates, setCoordinates] = useState<LngLat[]>([
    [-73.99155, 40.73581],
  ]);

  const renderAnnotations = () => {
    const items: ReactNode[] = [];

    coordinates.forEach((coordinate, i) => {
      const title = `Lon: ${coordinate[0]} Lat: ${coordinate[1]}`;
      const id = `pointAnnotation${i}`;

      if (i % 2 === 1) {
        items.push(
          <AnnotationWithRemoteImage
            key={id}
            id={id}
            lngLat={coordinate}
            title={title}
          />,
        );
      } else {
        items.push(
          <PointAnnotation key={id} id={id} lngLat={coordinate} title={title}>
            <View style={styles.annotationContainer} />
            <Callout title="This is an empty example" />
          </PointAnnotation>,
        );
      }
    });

    return items;
  };

  return (
    <>
      <MapView
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={(event) => {
          event.persist();

          setCoordinates((prevState) => [
            ...prevState,
            event.nativeEvent.lngLat,
          ]);
        }}
      >
        <Camera
          initialViewState={
            {
              ...(coordinates[0] && {
                center: coordinates[0],
              }),
              zoom: 16,
            } as InitialViewState
          }
        />

        {renderAnnotations()}
      </MapView>

      <Bubble>
        <Text>Click the map to add point annotations</Text>
      </Bubble>
    </>
  );
}
