import { generateAndroidTextureMapView } from "./android-texture-map-view/generateAndroidTextureMapView";
import { generateDocumentation } from "./documentation/generateDocumentation";
import { generateStyles } from "./styles/generateStyles";

async function generate() {
  await generateAndroidTextureMapView();
  await generateStyles();
  await generateDocumentation();
}

generate();
