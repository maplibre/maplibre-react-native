import {
  GeoJSONSource,
  Images,
  type ImagesProps,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import maplibreIcon from "@/assets/images/maplibre.png";
import { FEATURE_COLLECTION } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GeoJSONSourceIcon() {
  const [images, setImages] = useState<ImagesProps["images"]>({
    [FEATURE_COLLECTION.features[0]!.properties.name]: maplibreIcon,
  });

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Images
        images={images}
        onImageMissing={({ nativeEvent: { image } }) => {
          console.log("onImageMissing", image);

          setImages((prevState) => ({
            ...prevState,
            [image]: maplibreIcon,
          }));
        }}
      />
      <GeoJSONSource data={FEATURE_COLLECTION}>
        <Layer
          type="symbol"
          id="symbol-layer"
          style={{
            iconImage: ["get", "name"],
          }}
        />
      </GeoJSONSource>
    </Map>
  );
}
