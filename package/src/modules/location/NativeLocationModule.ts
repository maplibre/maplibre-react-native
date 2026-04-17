import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeGeolocationCoordinates = {
  longitude: CodegenTypes.Double;
  latitude: CodegenTypes.Double;
  accuracy: CodegenTypes.Double;
  altitude: CodegenTypes.Double | null;
  altitudeAccuracy: CodegenTypes.Double | null;
  heading: CodegenTypes.Double | null;
  speed: CodegenTypes.Double | null;
};

type NativeGeolocationPosition = {
  coords: NativeGeolocationCoordinates;
  timestamp: number;
};

export interface Spec extends TurboModule {
  start(): void;

  stop(): void;

  getCurrentPosition(): Promise<NativeGeolocationPosition>;

  setMinDisplacement(minDisplacement: number): void;

  requestPermissions(): Promise<void>;

  readonly onUpdate: CodegenTypes.EventEmitter<NativeGeolocationPosition>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNLocationModule");
