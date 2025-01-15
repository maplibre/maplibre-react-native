import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as MapLibreExamples from "./examples/index";
import { sheet } from "./styles/sheet";

const styles = StyleSheet.create({
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
  items: (ExampleGroup | ExampleItem)[];

  constructor(
    label: string,
    items: (ExampleGroup | ExampleItem)[],
    root = false,
  ) {
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
      new ExampleItem(
        "Create Offline Region",
        MapLibreExamples.CreateOfflineRegion,
      ),
      new ExampleItem(
        "Get Pixel Point in MapView",
        MapLibreExamples.PointInMapView,
      ),
      new ExampleItem(
        "Show and hide a layer",
        MapLibreExamples.ShowAndHideLayer,
      ),
      new ExampleItem("Change Layer Color", MapLibreExamples.ChangeLayerColor),
      new ExampleItem(
        "Source Layer Visiblity",
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
      new ExampleItem("Set Heading", MapLibreExamples.SetHeading),
      new ExampleItem("Fly To", MapLibreExamples.FlyTo),
      new ExampleItem("Restrict Bounds", MapLibreExamples.RestrictMapBounds),
      new ExampleItem("Yo-yo Camera", MapLibreExamples.YoYo),
      new ExampleItem(
        "Take Snapshot Without Map",
        MapLibreExamples.TakeSnapshot,
      ),
      new ExampleItem(
        "Take Snapshot With Map",
        MapLibreExamples.TakeSnapshotWithMap,
      ),
      new ExampleItem("Get current Zoom", MapLibreExamples.GetZoom),
      new ExampleItem("Get Center", MapLibreExamples.GetCenter),
      new ExampleItem("Compass View", MapLibreExamples.CompassView),
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
        MapLibreExamples.UserLocationUpdate,
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
      new ExampleItem("Query Feature Point", MapLibreExamples.QueryAtPoint),
      new ExampleItem(
        "Query Features Bounding Box",
        MapLibreExamples.QueryWithRect,
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
      new ExampleItem("Animated Line", MapLibreExamples.AnimatedLine),
      new ExampleItem(
        "Animate Circle along Line",
        MapLibreExamples.AnimateCircleAlongLine,
      ),
    ]),
    new ExampleItem("Cache Management", MapLibreExamples.CacheManagement),
  ],
  true,
);

function FlatMapExamples(
  example: ExampleGroup | ExampleItem,
  flattenedExamples: (ExampleGroup | ExampleItem)[] = [],
): (ExampleGroup | ExampleItem)[] {
  if (example instanceof ExampleGroup) {
    return [
      ...flattenedExamples,
      ...example.items.flatMap((example) => FlatMapExamples(example)),
      example,
    ];
  }

  return [...flattenedExamples, example];
}

const FlatExamples = FlatMapExamples(Examples);

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
    <View style={sheet.matchParent}>
      <View style={sheet.matchParent}>
        <FlatList
          style={sheet.matchParent}
          data={example instanceof ExampleGroup ? example.items : []}
          keyExtractor={(item) => item.label}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

function buildNavigationScreens(example: any, Stack: any) {
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
          card: "#295daa",
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
