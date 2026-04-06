import { generateAndroidTextureMapView } from "./tasks/generateAndroidTextureMapView";
import { generateDocumentation } from "./tasks/generateDocumentation";
import { generateStyles } from "./tasks/generateStyles";

async function generate() {
  await generateAndroidTextureMapView();
  await generateStyles();
  await generateDocumentation();
}

generate();
