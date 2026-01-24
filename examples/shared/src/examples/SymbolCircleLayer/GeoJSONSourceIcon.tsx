import {
  Images,
  MapView,
  GeoJSONSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import maplibreIcon from "@/assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GeoJSONSourceIcon() {
  const [images, setImages] = useState({
    [FEATURE_COLLECTION.features[0]!.properties.name]: maplibreIcon,
  });

  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Images
        images={images}
        onImageMissing={(imageKey) =>
          setImages((prevState) => ({
            ...prevState,
            [imageKey]: maplibreIcon,
          }))
        }
      />
      <GeoJSONSource data={FEATURE_COLLECTION}>
        <SymbolLayer
          id="symbol-layer"
          style={{
            iconImage: ["get", "name"],
          }}
        />
      </GeoJSONSource>
    </MapView>
  );
}
