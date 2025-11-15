import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeGeolocationCoordinates = {
  longitude: CodegenTypes.Double;
  latitude: CodegenTypes.Double;
  accuracy: CodegenTypes.Double;
  altitude: CodegenTypes.Double;
  altitudeAccuracy: CodegenTypes.Double | null;
  heading: CodegenTypes.Double;
  speed: CodegenTypes.Double;
};

type NativeGeolocationPosition = {
  coords: NativeGeolocationCoordinates;
  timestamp: number;
};

export interface Spec extends TurboModule {
  start(minDisplacement?: number): void;

  stop(): void;

  getCurrentPosition(): Promise<NativeGeolocationPosition>;

  setMinDisplacement(minDisplacement: number): void;

  readonly onUpdate: CodegenTypes.EventEmitter<NativeGeolocationPosition>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNLocationModule");
