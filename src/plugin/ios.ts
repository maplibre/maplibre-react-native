import {
  type ConfigPlugin,
  withPodfile,
  withXcodeProject,
  type XcodeProject,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

/**
 * Only the post-install block is required, the post installer block is used for SPM (Swift Package Manager) which Expo
 * doesn't currently support.
 */
export function applyPodfilePostInstall(contents: string): string {
  const result = mergeContents({
    tag: `@maplibre/maplibre-react-native-post_installer`,
    src: contents,
    newSrc: `    $MLRN.post_install(installer)`,
    anchor: new RegExp(`post_install do \\|installer\\|`),
    offset: 1,
    comment: "#",
  });

  if (result.didMerge || result.didClear) {
    return result.contents;
  }

  return contents;
}

const withPodfilePostInstall: ConfigPlugin = (config) => {
  return withPodfile(config, (c) => {
    c.modResults.contents = applyPodfilePostInstall(c.modResults.contents);

    return c;
  });
};

/**
 * Exclude building for arm64 on simulator devices in the pbxproj project.
 * Without this, production builds targeting simulators will fail.
 */
function setExcludedArchitectures(project: XcodeProject): XcodeProject {
  const configurations = project.pbxXCBuildConfigurationSection();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  for (const { name, buildSettings } of Object.values(configurations || {})) {
    // Guessing that this is the best way to emulate Xcode.
    // Using `project.addToBuildSettings` modifies too many targets.
    if (
      name === "Release" &&
      typeof buildSettings?.PRODUCT_NAME !== "undefined"
    ) {
      buildSettings['"EXCLUDED_ARCHS[sdk=iphonesimulator*]"'] = '"arm64"';
    }
  }

  return project;
}

const withoutSignatures: ConfigPlugin = (config) => {
  return withXcodeProject(config, async (c) => {
    c.modResults.addBuildPhase(
      [],
      "PBXShellScriptBuildPhase",
      "Remove signature files (Xcode workaround)",
      null,
      {
        shellPath: "/bin/sh",
        shellScript: `
          echo "Remove signature files (Xcode workaround)";
          rm -rf "$CONFIGURATION_BUILD_DIR/MapLibre.xcframework-ios.signature";
        `,
      },
    );

    return c;
  });
};

/**
 *  Set the Debug Information Format to DWARF with dSYM File during EAS Build for Managed App
 *  https://github.com/expo/eas-cli/issues/968
 *
 *  Set `artifactPath` in `eas.json`:
 *  ```json
 *  "ios": {
 *    "artifactPath": "ios/build/*"
 *  }
 *  ```
 */
const withDwarfDsym: ConfigPlugin = (config) => {
  return withXcodeProject(config, async (c) => {
    c.modResults.debugInformationFormat = "dwarf-with-dsym";

    return c;
  });
};

const withExcludedSimulatorArchitectures: ConfigPlugin = (config) => {
  return withXcodeProject(config, (c) => {
    c.modResults = setExcludedArchitectures(c.modResults);

    return c;
  });
};

export const ios = {
  withPodfilePostInstall,
  withoutSignatures,
  withDwarfDsym,
  withExcludedSimulatorArchitectures,
};
