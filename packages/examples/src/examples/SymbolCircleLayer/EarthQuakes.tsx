import MapLibreGL from "@maplibre/maplibre-react-native";
import { FeatureCollection } from "geojson";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  CircleLayerStyle,
  ShapeSourceRef,
  SymbolLayerStyle,
} from "../../../../../javascript";
import earthQuakesJSON from "../../assets/earthquakes.json";
import colors from "../../styles/colors";
import sheet from "../../styles/sheet";
import { SF_OFFICE_COORDINATE } from "../../utils";
import Page from "../common/Page";

const layerStyles: {
  singlePoint: CircleLayerStyle;
  clusteredPoints: CircleLayerStyle;
  clusterCount: SymbolLayerStyle;
} = {
  singlePoint: {
    circleColor: "green",
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 5,
    circlePitchAlignment: "map",
  },

  clusteredPoints: {
    circlePitchAlignment: "map",
    circleColor: [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
  },

  clusterCount: {
    textField: [
      "format",
      ["concat", ["get", "point_count"], "\n"],
      {},
      [
        "concat",
        ">1: ",
        [
          "+",
          ["get", "mag2"],
          ["get", "mag3"],
          ["get", "mag4"],
          ["get", "mag5"],
        ],
      ],
      { "font-scale": 0.8 },
    ],
    textSize: 12,
    textPitchAlignment: "map",
  },
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: colors.grey,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  touchable: {
    backgroundColor: colors.blue,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const mag1 = ["<", ["get", "mag"], 2];
const mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
const mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
const mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
const mag5 = [">=", ["get", "mag"], 5];

export default function EarthQuakes() {
  const shapeSource = useRef<ShapeSourceRef>(null);
  const [cluster, setCluster] = useState<GeoJSON.FeatureCollection>();

  return (
    <Page>
      <Modal visible={!!cluster}>
        <SafeAreaProvider>
          <SafeAreaView
            edges={["top", "bottom"]}
            style={{ position: "relative" }}
          >
            {cluster && (
              <FlatList
                stickyHeaderIndices={[0]}
                ListHeaderComponent={() => {
                  return (
                    <View style={styles.header}>
                      <Text style={styles.headerText}>
                        Earthquakes ({cluster.features.length})
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setCluster(undefined);
                        }}
                        style={styles.touchable}
                      >
                        <Text style={styles.touchableText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={({ properties: earthquakeInfo }) => {
                  return earthquakeInfo?.code;
                }}
                data={cluster.features}
                renderItem={({ item: { properties: earthquakeInfo } }) => {
                  const magnitude = `Magnitude: ${earthquakeInfo?.mag}`;
                  const place = `Place: ${earthquakeInfo?.place}`;
                  const code = `Code: ${earthquakeInfo?.code}`;
                  const time = `Time: ${moment(earthquakeInfo?.time).format(
                    "MMMM Do YYYY, h:mm:ss a",
                  )}`;

                  return (
                    <View style={styles.listItem}>
                      <Text style={styles.listItemTitle}>
                        {earthquakeInfo?.title}
                      </Text>
                      <Text>{magnitude}</Text>
                      <Text>{place}</Text>
                      <Text>{code}</Text>
                      <Text>{time}</Text>
                    </View>
                  );
                }}
              />
            )}
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>

      <Page>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera
            zoomLevel={6}
            pitch={45}
            centerCoordinate={SF_OFFICE_COORDINATE}
          />

          <MapLibreGL.ShapeSource
            id="earthquakes"
            ref={shapeSource}
            shape={earthQuakesJSON as unknown as FeatureCollection}
            onPress={async (event) => {
              const cluster = event.features[0];

              console.log(cluster.type);
              if (cluster.type === "Feature") {
                const collection = await shapeSource.current?.getClusterLeaves(
                  // TODO: improve once GeoJSON types are aligned
                  // @ts-ignore
                  cluster,
                  999,
                  0,
                );

                setCluster(collection as FeatureCollection);
              }
            }}
            cluster
            clusterRadius={50}
            clusterMaxZoomLevel={14}
            clusterProperties={{
              mag1: [
                ["+", ["accumulated"], ["get", "mag1"]],
                ["case", mag1, 1, 0],
              ],
              mag2: [
                ["+", ["accumulated"], ["get", "mag2"]],
                ["case", mag2, 1, 0],
              ],
              mag3: [
                ["+", ["accumulated"], ["get", "mag3"]],
                ["case", mag3, 1, 0],
              ],
              mag4: [
                ["+", ["accumulated"], ["get", "mag4"]],
                ["case", mag4, 1, 0],
              ],
              mag5: [
                ["+", ["accumulated"], ["get", "mag5"]],
                ["case", mag5, 1, 0],
              ],
            }}
          >
            <MapLibreGL.SymbolLayer
              id="pointCount"
              style={layerStyles.clusterCount}
            />

            <MapLibreGL.CircleLayer
              id="clusteredPoints"
              belowLayerID="pointCount"
              filter={["has", "point_count"]}
              style={layerStyles.clusteredPoints}
            />

            <MapLibreGL.CircleLayer
              id="singlePoint"
              filter={["!", ["has", "point_count"]]}
              style={layerStyles.singlePoint}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>
      </Page>
    </Page>
  );
}
