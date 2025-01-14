import {
  Callout,
  Camera,
  FillLayer,
  MapView,
  PointAnnotation,
  type PointAnnotationRef,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { type ReactNode, useRef, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

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
  coordinate: GeoJSON.Position;
};

const AnnotationWithRemoteImage = ({
  id,
  coordinate,
  title,
}: AnnotationWithRemoteImageProps) => {
  const pointAnnotation = useRef<PointAnnotationRef>(null);

  return (
    <PointAnnotation
      id={id}
      coordinate={coordinate}
      title={title}
      draggable
      onSelected={(feature) =>
        console.log("onSelected:", feature.id, feature.geometry.coordinates)
      }
      onDrag={(feature) =>
        console.log("onDrag:", feature.id, feature.geometry.coordinates)
      }
      onDragStart={(feature) =>
        console.log("onDragStart:", feature.id, feature.geometry.coordinates)
      }
      onDragEnd={(feature) =>
        console.log("onDragEnd:", feature.id, feature.geometry.coordinates)
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
  const [coordinates, setCoordinates] = useState([[-73.99155, 40.73581]]);
  const [layerRendering, setLayerRendering] = useState<"below" | "above">(
    "below",
  );

  const renderAnnotations = () => {
    const items: ReactNode[] = [];

    coordinates.forEach((coordinate, i) => {
      const title = `Lon: ${coordinate[0]} Lat: ${coordinate[1]}`;
      const id = `pointAnnotation${i}`;

      if (i % 2 === 1) {
        items.push(
          null,
          <AnnotationWithRemoteImage
            key={id}
            id={id}
            coordinate={coordinate}
            title={title}
          />,
        );
      } else {
        items.push(
          null,
          <PointAnnotation
            key={id}
            id={id}
            coordinate={coordinate}
            title={title}
          >
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
        onPress={(feature) => {
          setCoordinates((prevState) => [
            ...prevState,
            (feature.geometry as GeoJSON.Point).coordinates,
          ]);
        }}
        style={sheet.matchParent}
      >
        <Camera
          defaultSettings={{ centerCoordinate: coordinates[0], zoomLevel: 16 }}
        />

        {renderAnnotations()}

        <ShapeSource
          id="polygon"
          shape={{
            coordinates: [
              [
                [-73.98813787946587, 40.73199795542578],
                [-73.98313197853199, 40.7388685230859],
                [-73.98962548210226, 40.74155214586244],
                [-73.9945841575561, 40.73468185536569],
                [-73.98813787946587, 40.73199795542578],
              ],
            ],
            type: "Polygon",
          }}
        >
          <FillLayer
            id="polygon"
            {...(Platform.OS === "android" && {
              [layerRendering + "LayerID"]: "'org.maplibre.annotations.points'",
            })}
            style={{
              fillColor: "rgba(255, 0, 0, 0.5)",
              fillOutlineColor: "red",
            }}
          />
        </ShapeSource>
      </MapView>

      <Bubble>
        <Text style={{ marginBottom: 10 }}>
          Click to add a point annotation
        </Text>
        <TouchableOpacity
          disabled={Platform.OS !== "android"}
          onPress={() =>
            setLayerRendering(
              (prevState) =>
                (({ above: "below", below: "above" }) as const)[prevState],
            )
          }
        >
          <Text>
            Android only: Render Polygon{" "}
            {{ above: "below", below: "above" }[layerRendering]}
          </Text>
        </TouchableOpacity>
      </Bubble>
    </>
  );
}
