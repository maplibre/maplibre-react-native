import { Platform, type TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {}

const imagesModule =
  Platform.OS === "ios"
    ? TurboModuleRegistry.getEnforcing<Spec>("MLRNImagesModule")
    : null;

export default imagesModule;
