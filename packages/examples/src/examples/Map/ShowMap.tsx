// import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

// import sheet from "../../styles/sheet";
// import { onSortOptions } from "../../utils";
// import TabBarPage from "../common/TabBarPage";

let MapLibreGL: any;
try {
  console.log("Attempting to import MapLibreGL");
  MapLibreGL = require("@maplibre/maplibre-react-native");
  // native modules do exist on MapLibreGL, but we can't access them from the JS side for some reason
  console.log("Available Native Modules:", Object.keys(MapLibreGL));
  console.log("MapLibreGL import successful");
} catch (error) {
  console.error("Error importing MapLibreGL:", error);
}

// const OPTIONS = Object.keys(MapLibreGL)
//   .map((key) => {
//     return {
//       label: key,
//       data: (MapLibreGL as any)[key], // bad any, because enums
//     };
//   })
//   .sort(onSortOptions);

export default function ShowMap() {
  // const [styleURL, setStyleURL] = useState(OPTIONS[0].data);

  // useEffect(() => {
  //   MapLibreGL.locationManager.start();

  //   return (): void => {
  //     MapLibreGL.locationManager.stop();
  //   };
  // }, []);

  return (
    // <TabBarPage
    //   scrollable
    //   options={OPTIONS}
    //   onOptionPress={(index, data): void => {
    //     setStyleURL(data);
    //   }}
    // >
    <View
      style={{
        flex: 1,
        backgroundColor: "blue",
      }}
    >
      <MapLibreGL.MapView
        style={{
          flex: 1,
          alignSelf: "stretch",
        }}
        logoEnabled={false}
      >
        <MapLibreGL.Camera
          defaultSettings={{
            centerCoordinate: [-2.15761, 53.40979],
            zoomLevel: 5,
          }}
        />
        {/* <MapLibreGL.UserLocation
          onPress={() => {
            Alert.alert("You pressed on the user location annotation");
          }}
        /> */}
      </MapLibreGL.MapView>
    </View>
    // </TabBarPage>
  );
}
