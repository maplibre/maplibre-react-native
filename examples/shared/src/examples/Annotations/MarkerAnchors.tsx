import { Marker } from "@maplibre/maplibre-react-native";

import { AbstractAnchors } from "./AbstractAnchors";

export function MarkerAnchors() {
  return <AbstractAnchors AnnotationComponent={Marker} />;
}
