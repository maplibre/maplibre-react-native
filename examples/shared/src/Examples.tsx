import {
  DefaultTheme,
  NavigationContainer,
  type TypedNavigator,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as MapLibreE2E from "./examples/e2e/index";
import * as MapLibreExamples from "./examples/index";
import { colors } from "./styles/colors";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  exampleListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  exampleListItemBorder: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  exampleListLabel: {
    fontSize: 18,
  },
});

type ExampleListItem = ExampleGroup | ExampleItem;

class ExampleItem {
  label: string;
  Component: any;

  constructor(label: string, Component: any) {
    this.label = label;
    this.Component = Component;
  }
}

class ExampleGroup {
  root: boolean;
  label: string;
  items: ExampleListItem[];

  constructor(label: string, items: ExampleListItem[], root = false) {
    this.root = root;
    this.label = label;
    this.items = items;
  }
}

const Examples = new ExampleGroup(
  "MapLibre React Native",
  [
    new ExampleItem("Bug Report", MapLibreExamples.BugReport),

    new ExampleGroup("Map", [
      new ExampleItem("Show Map", MapLibreExamples.ShowMap),
      new ExampleItem("Local Style from JSON", MapLibreExamples.LocalStyleJSON),
      new ExampleItem("Show Click", MapLibreExamples.ShowClick),
      new ExampleItem(
        "Show Region did Change",
        MapLibreExamples.ShowRegionDidChange,
      ),
      new ExampleItem("Two Map Views", MapLibreExamples.TwoMapViews),
      new ExampleItem("Compass", MapLibreExamples.Compass),
      new ExampleItem(
        "Create Offline Region",
        MapLibreExamples.CreateOfflineRegion,
      ),
      new ExampleItem(
        "Project/Unproject between Coordinates/Pixel Point",
        MapLibreExamples.ProjectUnproject,
      ),
      new ExampleItem(
        "Show and hide a layer",
        MapLibreExamples.ShowAndHideLayer,
      ),
      new ExampleItem("Change Layer Color", MapLibreExamples.ChangeLayerColor),
      new ExampleItem(
        "Source Layer Visibility",
        MapLibreExamples.SourceLayerVisibility,
      ),
      new ExampleItem("Set Tint Color", MapLibreExamples.SetTintColor),
    ]),

    new ExampleGroup("Camera", [
      new ExampleItem(
        "Fit (Bounds, Center/Zoom, Padding)",
        MapLibreExamples.Fit,
      ),
      new ExampleItem("Set Pitch", MapLibreExamples.SetPitch),
      new ExampleItem("Set Bearing", MapLibreExamples.SetBearing),
      new ExampleItem("Fly To", MapLibreExamples.FlyTo),
      new ExampleItem("Restrict Bounds", MapLibreExamples.RestrictMapBounds),
      new ExampleItem("Yo-yo Camera", MapLibreExamples.YoYo),
      new ExampleItem(
        "Take Snapshot Without Map",
        MapLibreExamples.TakeSnapshotWithoutMap,
      ),
      new ExampleItem(
        "Take Snapshot With Map",
        MapLibreExamples.TakeSnapshotWithMap,
      ),
      new ExampleItem("Get current Zoom", MapLibreExamples.GetZoom),
      new ExampleItem("Get Center", MapLibreExamples.GetCenter),
    ]),

    new ExampleGroup("User Location", [
      new ExampleItem(
        "Follow User Location Alignment",
        MapLibreExamples.FollowUserLocationAlignment,
      ),
      new ExampleItem(
        "Follow User Location Render Mode",
        MapLibreExamples.FollowUserLocationRenderMode,
      ),
      new ExampleItem(
        "User Location for Navigation",
        MapLibreExamples.UserLocationForNavigation,
      ),
      new ExampleItem(
        "User Location Updates",
        MapLibreExamples.UserLocationUpdates,
      ),
      new ExampleItem(
        "User Location Displacement",
        MapLibreExamples.UserLocationDisplacement,
      ),

      new ExampleItem(
        "Set preferred Frames per Second\n(Android only)",
        MapLibreExamples.SetAndroidPreferredFramesPerSecond,
      ),
    ]),

    new ExampleGroup("Symbol/CircleLayer", [
      new ExampleItem("Custom Icon", MapLibreExamples.CustomIcon),
      new ExampleItem("SDF Icon", MapLibreExamples.SdfIcon),
      new ExampleItem("Clustering Earthquakes", MapLibreExamples.Earthquakes),
      new ExampleItem(
        "Icon from Shape Source",
        MapLibreExamples.ShapeSourceIcon,
      ),
      new ExampleItem(
        "Data-driven Circle Colors",
        MapLibreExamples.DataDrivenCircleColors,
      ),
    ]),

    new ExampleGroup("Fill/RasterLayer", [
      new ExampleItem("GeoJSON Source", MapLibreExamples.GeoJSONSource),
      new ExampleItem(
        "OpenStreetMap Raster Tiles",
        MapLibreExamples.OpenStreetMapRasterTiles,
      ),
      new ExampleItem("Indoor Building Map", MapLibreExamples.IndoorBuilding),
      new ExampleItem(
        "Query Feature with Point",
        MapLibreExamples.QueryWithPoint,
      ),
      new ExampleItem(
        "Query Features with Bounding Box",
        MapLibreExamples.QueryWithBounds,
      ),
      new ExampleItem(
        "Custom Vector Source",
        MapLibreExamples.CustomVectorSource,
      ),
      new ExampleItem("Image Overlay", MapLibreExamples.ImageOverlay),
    ]),

    new ExampleGroup("LineLayer", [
      new ExampleItem("Gradient Line", MapLibreExamples.GradientLine),
    ]),

    new ExampleGroup("Sources", [
      new ExampleItem("PMTiles Map Style", MapLibreExamples.PMTilesMapStyle),
      new ExampleItem(
        "PMTiles Vector Source",
        MapLibreExamples.PMTilesVectorSource,
      ),
    ]),

    new ExampleGroup("Annotations", [
      new ExampleItem(
        "Show Point Annotation",
        MapLibreExamples.ShowPointAnnotation,
      ),
      new ExampleItem(
        "Point Annotation Anchors",
        MapLibreExamples.PointAnnotationAnchors,
      ),
      new ExampleItem("Marker View", MapLibreExamples.MarkerView),
      new ExampleItem("Heatmap", MapLibreExamples.Heatmap),
      new ExampleItem("Custom Callout", MapLibreExamples.CustomCallout),
    ]),

    new ExampleGroup("Animations", [
      new ExampleItem(
        "Animate Circle along Line",
        MapLibreExamples.AnimateCircleAlongLine,
      ),
      new ExampleItem("Animated Length", MapLibreExamples.AnimatedLength),
      new ExampleItem("Animated Morph", MapLibreExamples.AnimatedMorph),
      new ExampleItem("Animated Size", MapLibreExamples.AnimatedSize),
      new ExampleItem("Reanimated Point", MapLibreExamples.ReanimatedPoint),
    ]),

    new ExampleItem("Cache Management", MapLibreExamples.CacheManagement),

    new ExampleGroup("E2E Tests", [
      new ExampleGroup("MapView", [
        new ExampleItem("MapView getBearing", MapLibreE2E.MapView.GetBearing),
        new ExampleItem("MapView getCenter", MapLibreE2E.MapView.GetCenter),
        new ExampleItem("MapView getPitch", MapLibreE2E.MapView.GetPitch),
        new ExampleItem(
          "MapView getViewState",
          MapLibreE2E.MapView.GetViewState,
        ),
        new ExampleItem("MapView getZoom", MapLibreE2E.MapView.GetZoom),
        new ExampleItem("MapView project", MapLibreE2E.MapView.Project),
        new ExampleItem(
          "MapView queryRenderedFeatures",
          MapLibreE2E.MapView.QueryRenderedFeatures,
        ),
        new ExampleItem(
          "MapView showAttribution",
          MapLibreE2E.MapView.ShowAttribution,
        ),
        new ExampleItem("MapView unproject", MapLibreE2E.MapView.Unproject),
      ]),

      new ExampleGroup("ShapeSource", [
        new ExampleItem("ShapeSource getData", MapLibreE2E.ShapeSource.GetData),
        new ExampleItem(
          "ShapeSource getClusterExpansionZoom",
          MapLibreE2E.ShapeSource.GetClusterExpansionZoom,
        ),
        new ExampleItem(
          "ShapeSource getClusterLeaves",
          MapLibreE2E.ShapeSource.GetClusterLeaves,
        ),
        new ExampleItem(
          "ShapeSource getClusterChildren",
          MapLibreE2E.ShapeSource.GetClusterChildren,
        ),
      ]),
    ]),
  ],
  true,
);

function flatMapExamples(
  example: ExampleListItem,
  flattenedExamples: ExampleListItem[] = [],
): ExampleListItem[] {
  if (example instanceof ExampleGroup) {
    return [
      ...flattenedExamples,
      ...example.items.flatMap((item) => flatMapExamples(item)),
      example,
    ];
  }

  return [...flattenedExamples, example];
}

const FlatExamples = flatMapExamples(Examples);

interface ExampleListProps {
  navigation: any;
  route: any;
}

function ExampleList({ route, navigation }: ExampleListProps) {
  const { name } = route;
  const example =
    FlatExamples.find((examples) => examples.label === name) || Examples;

  function itemPress(item: any) {
    navigation.navigate(item.label);
  }

  function renderItem({ item }: { item: any }) {
    return (
      <View style={styles.exampleListItemBorder}>
        <TouchableOpacity onPress={() => itemPress(item)}>
          <View style={styles.exampleListItem}>
            <Text style={styles.exampleListLabel}>{item.label}</Text>
            <Text style={{ fontSize: 24 }}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.flex1}>
      <FlatList
        style={styles.flex1}
        data={example instanceof ExampleGroup ? example.items : []}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
      />
    </View>
  );
}

function buildNavigationScreens(
  example: ExampleListItem,
  Stack: TypedNavigator<any>,
) {
  if (example instanceof ExampleGroup) {
    return (
      <Stack.Screen
        key={example.label}
        name={example.label}
        component={ExampleList}
      />
    );
  }

  return (
    <Stack.Screen
      key={example.label}
      name={example.label}
      component={example.Component}
    />
  );
}

export function Home() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          card: colors.blue,
          primary: "#ffffff",
          background: "#ffffff",
          text: "#ffffff",
        },
      }}
    >
      <Stack.Navigator initialRouteName={Examples.label}>
        {FlatExamples.map((example) => buildNavigationScreens(example, Stack))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
