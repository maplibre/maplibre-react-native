import { ViewAnnotation } from "@maplibre/maplibre-react-native";

import { AbstractAnchors } from "./AbstractAnchors";

export function ViewAnnotationAnchors() {
  return <AbstractAnchors AnnotationComponent={ViewAnnotation} />;
}
