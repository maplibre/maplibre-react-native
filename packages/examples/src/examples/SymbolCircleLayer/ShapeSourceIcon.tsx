import {
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import maplibreIcon from "../../assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

export function ShapeSourceIcon() {
  const [images, setImages] = useState({
    [FEATURE_COLLECTION.features[0]!.properties.name]: maplibreIcon,
  });

  return (
    <MapView style={sheet.matchParent}>
      <Images
        images={images}
        onImageMissing={(imageKey) =>
          setImages((prevState) => ({
            ...prevState,
            [imageKey]: maplibreIcon,
          }))
        }
      />
      <ShapeSource id="shape-source" shape={FEATURE_COLLECTION}>
        <SymbolLayer
          id="symbol-layer"
          style={{
            iconImage: ["get", "name"],
          }}
        />
      </ShapeSource>
    </MapView>
  );
}
