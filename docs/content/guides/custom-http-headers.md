# Custom HTTP Headers

## Intro

Custom headers are implemented using OkHttp interceptor for android and method swizzling for iOS.

[Method swizzling](https://en.wikipedia.org/wiki/Monkey_patch) is done on the `[NSMutableURLRequest requestWithURL:]` to allow adding headers during runtime.

:::danger[Headers will be included on all Requests]

Be aware that these headers are included to all map requests. Especially if you have multiple map tile sources. It may "leak" your authorization header.

:::

## Prerequisites

### Android

None

### iOS

To enable this on iOS you need to call `MLRNCustomHeaders().initHeaders()` and `MLRNCustomHeaders().addHeader()` pretty early in the lifecycle of the application. This will swizzle the custom method.
Suggested location is `AppDelegate: application()`

### Working Example

#### Expo plugin

For convenience here is an Expo plugin that will add import and headers into `AppDelegate.swift` so you do not have to do it manually.

```json title="app.json"
{
  "plugins": [
    [
      "./plugins/withCustomHeadersPlugin.ts",
      {
        "headers": [["Authorization", "sECrEt"]]
      }
    ]
  ]
}
```

```ts title="plugins/withCustomHeadersPlugin.ts"
// Inspired by https://github.com/invertase/react-native-firebase/blob/main/packages/app/plugin/src/ios/appDelegate.ts

import configPlugin, { type ConfigPlugin } from "@expo/config-plugins";
import { type AppDelegateProjectFile } from "@expo/config-plugins/build/ios/Paths";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "fs";

const { IOSConfig, WarningAggregator, withDangerousMod } = configPlugin;

function modifySwiftAppDelegate(contents: string, headers: Header[]): string {
  let methodInvocationBlock = `\t\tMLRNCustomHeaders().initHeaders()`;
  headers.forEach((value) => {
    methodInvocationBlock += `\n\t\tMLRNCustomHeaders().addHeader("${value[1].replaceAll('"', '\\"')}", forHeaderName: "${value[0]}")`;
  });
  // MLRNCustomHeaders().addHeader(
  const methodInvocationLineMatcher =
    /(?:self\.moduleName\s*=\s*"([^"]*)")|(?:factory\.startReactNative\()/;

  // Add import
  if (!contents.includes("import MapLibreReactNative")) {
    contents = contents.replace(
      /import Expo/g,
      `import Expo
import MapLibreReactNative`,
    );
  }
  if (!methodInvocationLineMatcher.test(contents)) {
    WarningAggregator.addWarningIOS(
      "Custom Headers Plugin",
      "Unable to determine correct insertion point in AppDelegate.swift. Skipping addition.",
    );
    return contents;
  }

  // Add invocation
  return mergeContents({
    tag: "custom header plugin",
    src: contents,
    newSrc: methodInvocationBlock,
    anchor: methodInvocationLineMatcher,
    offset: 0, // new line will be inserted right above matched anchor
    comment: "//",
  }).contents;
}

async function modifyAppDelegateAsync(
  appDelegateFileInfo: AppDelegateProjectFile,
  headers: Header[],
) {
  const { contents, path } = appDelegateFileInfo;
  let newContents = modifySwiftAppDelegate(contents, headers);
  await fs.promises.writeFile(path, newContents);
}

const withAppDelegate: ConfigPlugin<Props> = (config, { headers }) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const fileInfo = IOSConfig.Paths.getAppDelegate(
        config.modRequest.projectRoot,
      );
      await modifyAppDelegateAsync(fileInfo, headers);
      return config;
    },
  ]);
};

type Header = [string, string];

type Props = {
  headers: Header[];
};

const withCustomHeadersPlugin: ConfigPlugin<Props> = (config, props) =>
  withAppDelegate(config, props);

export default withCustomHeadersPlugin;
```

#### Expo `AppDelegate.swift`

When not using Expo plugins the import, init and headers can be added manually.

```diff title="AppDelegate.swift"
import Expo
import FirebaseCore
import React
import ReactAppDependencyProvider
+import MapLibreReactNative

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)

+   MLRNCustomHeaders().initHeaders()
+   MLRNCustomHeaders().addHeader("sECrEt", forHeaderName: "Authorization")

    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  // ...
}
```

#### React Native 0.76.9 `AppDelegate.mm`

```diff title="AppDelegate.mm"
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
+#import "MLRNCustomHeaders.h"

@implementation AppDelegate

 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"RnDiffApp";
  self.initialProps = @{};

+  [[MLRNCustomHeaders sharedInstance] initHeaders];
+  [[MLRNCustomHeaders sharedInstance] addHeader:@"sEcReT" forHeaderName:@"Authorization"];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// ...

@end
```

#### React Native 0.80.1 `AppDelegate.swift`

```diff title="AppDelegate.swift"
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
+import maplibre_react_native

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

+   MLRNCustomHeaders().initHeaders()
+   MLRNCustomHeaders().addHeader("sECrEt", forHeaderName: "Authorization")

    factory.startReactNative(
      withModuleName: "RnDiffApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

// ...

}
```

## Sending custom HTTP Headers with the Tile Requests

You can configure sending of custom HTTP headers to your tile server. This is to support custom authentication or custom metadata which can't be included in the url.

You can add and remove headers at runtime.

### Adding a Header

```ts
addCustomHeader("Authorization", "sEcReT");
```

### Removing a Header

```ts
removeCustomHeader("Authorization");
```

### Working Example

```tsx
function App() {
  useEffect(() => {
    addCustomHeader("Authorization", "sEcReT");
  }, []);

  return <MapView />;
}
```
