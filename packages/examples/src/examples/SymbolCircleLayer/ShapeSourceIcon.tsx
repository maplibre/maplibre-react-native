import MapLibreGL from "@maplibre/maplibre-react-native";
import { useState } from "react";

import maplibreIcon from "../../assets/images/maplibre.png";
import Page from "../../components/Page";
import { FEATURE_COLLECTION } from "../../constants/GEOMETRIES";
import sheet from "../../styles/sheet";

export default function ShapeSourceIcon() {
  const [images, setImages] = useState({
    [FEATURE_COLLECTION.features[0]!.properties.name]: maplibreIcon,
  });

  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Images
          images={images}
          onImageMissing={(imageKey) =>
            setImages((prevState) => ({
              ...prevState,
              [imageKey]: maplibreIcon,
            }))
          }
        />
        <MapLibreGL.ShapeSource id="shape-source" shape={FEATURE_COLLECTION}>
          <MapLibreGL.SymbolLayer
            id="symbol-layer"
            style={{
              iconImage: ["get", "name"],
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </Page>
  );
}
