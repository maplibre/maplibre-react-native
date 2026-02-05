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

import * as MapLibreE2E from "@/examples/e2e/index";
import * as MapLibreExamples from "@/examples/index";
import { colors } from "@/styles/colors";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  exampleListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
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
  id: string;
  label: string;
  Component: any;

  constructor(label: string, Component: any, id?: string) {
    this.id = id || label;
    this.label = label;
    this.Component = Component;
  }
}

class ExampleGroup {
  id: string;
  root: boolean;
  label: string;
  items: ExampleListItem[];

  constructor(
    label: string,
    items: ExampleListItem[],
    root = false,
    id?: string,
  ) {
    this.id = id || label;
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
      new ExampleItem("Two Maps", MapLibreExamples.TwoMaps),
      new ExampleItem("Compass", MapLibreExamples.Compass),
      new ExampleItem(
        "Create Static Map from Map",
        MapLibreExamples.CreateStaticMapFromMap,
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
      new ExampleItem("Get Zoom", MapLibreExamples.GetZoom),
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
        "GeoJSONSource with Icons",
        MapLibreExamples.GeoJSONSourceIcon,
      ),
    ]),

    new ExampleGroup("Fill/RasterLayer", [
      new ExampleItem(
        "GeoJSONSource FeatureCollection",
        MapLibreExamples.GeoJSONSourceFeatureCollection,
      ),
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

      new ExampleItem("Heatmap", MapLibreExamples.Heatmap),
    ]),

    new ExampleGroup("LineLayer", [
      new ExampleItem("Gradient Line", MapLibreExamples.GradientLine),
    ]),

    new ExampleGroup("Protocols", [
      new ExampleItem("PMTiles Map Style", MapLibreExamples.PMTilesMapStyle),
      new ExampleItem(
        "PMTiles Vector Source",
        MapLibreExamples.PMTilesVectorSource,
      ),
    ]),

    new ExampleGroup("Styles", [
      new ExampleItem("Style JSON Interop", MapLibreExamples.StyleJSONInterop),
    ]),

    new ExampleGroup("Annotations", [
      new ExampleItem(
        "Show ViewAnnotation",
        MapLibreExamples.ShowViewAnnotation,
      ),
      new ExampleItem(
        "ViewAnnotation Anchors",
        MapLibreExamples.ViewAnnotationAnchors,
      ),
      new ExampleItem("Marker", MapLibreExamples.Marker),
      new ExampleItem("Marker as Callout", MapLibreExamples.MarkerAsCallout),
    ]),

    new ExampleGroup("Animated", [
      new ExampleItem(
        "Animate Circle along Line",
        MapLibreExamples.AnimateCircleAlongLine,
      ),
      new ExampleItem("Animated Length", MapLibreExamples.AnimatedLength),
      new ExampleItem("Animated Morph", MapLibreExamples.AnimatedMorph),
      new ExampleItem("Animated Size", MapLibreExamples.AnimatedSize),
      new ExampleItem("Reanimated Point", MapLibreExamples.ReanimatedPoint),
      new ExampleItem("Reanimated Marker", MapLibreExamples.ReanimatedMarker),
    ]),

    new ExampleGroup("OfflineManager", [
      new ExampleItem(
        "Create Offline Pack",
        MapLibreExamples.CreateOfflinePack,
      ),
      new ExampleItem("Cache Management", MapLibreExamples.CacheManagement),
    ]),

    new ExampleItem(
      "StaticMapManager: Create Image",
      MapLibreExamples.CreateStaticMapWithoutMap,
    ),

    new ExampleItem(
      "NetworkManager: Request Headers",
      MapLibreExamples.NetworkRequestHeaders,
    ),

    new ExampleGroup("E2E Tests", [
      new ExampleGroup("Map", [
        new ExampleItem(
          "Map androidView='texture'",
          MapLibreE2E.Map.AndroidViewTexture,
        ),

        new ExampleItem("Map getBearing", MapLibreE2E.Map.GetBearing),
        new ExampleItem("Map getCenter", MapLibreE2E.Map.GetCenter),
        new ExampleItem("Map getPitch", MapLibreE2E.Map.GetPitch),
        new ExampleItem("Map getViewState", MapLibreE2E.Map.GetViewState),
        new ExampleItem("Map getZoom", MapLibreE2E.Map.GetZoom),
        new ExampleItem("Map project", MapLibreE2E.Map.Project),
        new ExampleItem(
          "Map queryRenderedFeatures",
          MapLibreE2E.Map.QueryRenderedFeatures,
        ),
        new ExampleItem("Map showAttribution", MapLibreE2E.Map.ShowAttribution),
        new ExampleItem("Map unproject", MapLibreE2E.Map.Unproject),
      ]),

      new ExampleGroup("GeoJSONSource", [
        new ExampleItem(
          "GeoJSONSource getData",
          MapLibreE2E.GeoJSONSource.GetData,
        ),
        new ExampleItem(
          "GeoJSONSource getClusterExpansionZoom",
          MapLibreE2E.GeoJSONSource.GetClusterExpansionZoom,
        ),
        new ExampleItem(
          "GeoJSONSource getClusterLeaves",
          MapLibreE2E.GeoJSONSource.GetClusterLeaves,
        ),
        new ExampleItem(
          "GeoJSONSource getClusterChildren",
          MapLibreE2E.GeoJSONSource.GetClusterChildren,
        ),
      ]),
    ]),
  ],
  true,
);

function flatMapExamples(
  example: ExampleListItem,
  flattenedExamples: ExampleListItem[] = [],
  parentPath = "",
): ExampleListItem[] {
  if (example instanceof ExampleGroup) {
    const currentPath = parentPath
      ? `${parentPath} > ${example.label}`
      : example.label;
    example.id = currentPath;

    return [
      ...flattenedExamples,
      ...example.items.flatMap((item) =>
        flatMapExamples(item, [], currentPath),
      ),
      example,
    ];
  }

  example.id = parentPath ? `${parentPath} › ${example.label}` : example.label;

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
    FlatExamples.find((examples) => examples.id === name) || Examples;

  function itemPress(item: ExampleListItem) {
    navigation.navigate(item.id);
  }

  function renderItem({ item }: { item: ExampleListItem }) {
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
        keyExtractor={(item) => item.id}
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
        key={example.id}
        name={example.id}
        component={ExampleList}
        options={{ title: example.label }}
      />
    );
  }

  return (
    <Stack.Screen
      key={example.id}
      name={example.id}
      component={example.Component}
      options={{ title: example.label }}
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
      <Stack.Navigator initialRouteName={Examples.id}>
        {FlatExamples.map((example) => buildNavigationScreens(example, Stack))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
