import MapLibreGL from "@maplibre/maplibre-react-native";
import { sheet, colors } from "@maplibre-react-native/examples";
import { default as Home } from "@maplibre-react-native/examples/src/scenes/Examples";
import { IS_ANDROID } from "@maplibre-react-native/examples/src/utils";
import React from "react";
import { StyleSheet, Text, View, LogBox, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

LogBox.ignoreLogs([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
]);

const styles = StyleSheet.create({
  noPermissionsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

MapLibreGL.setAccessToken(null);
Icon.loadFont();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      activeExample: -1,
    };
  }

  async componentDidMount() {
    if (IS_ANDROID) {
      const isGranted = await MapLibreGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <SafeAreaView
          style={[sheet.matchParent, { backgroundColor: colors.primary.blue }]}
          forceInset={{ top: "always" }}
        >
          <View style={sheet.matchParent}>
            <Text style={styles.noPermissionsText}>
              You need to accept location permissions in order to use this
              example applications
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return <Home />;
  }
}

export default App;
