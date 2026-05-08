import { defineConfig, globalIgnores } from "eslint/config";
import universeNativeConfig from "eslint-config-universe/flat/native.js";

export default defineConfig([
  globalIgnores(["**/build", "**/lib"]),
  universeNativeConfig,
]);
