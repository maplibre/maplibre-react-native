# Custom HTTP Headers

## Intro

Custom headers are implemented using OkHttp interceptor for android and method swizzling for iOS.

[Method swizzling](https://en.wikipedia.org/wiki/Monkey_patch) is done on the `[NSMutableURLRequest requestWithURL:]` to allow adding headers during runtime.

## Prerequisites

### Android

None

### iOS

To enable this on iOS you need to call `MLRNCustomHeaders().initHeaders()` and `MLRNCustomHeaders().addHeader()` pretty early in the lifecycle of the application. This will swizzle the custom method.
Suggested location is `AppDelegate: application()`

### Working Example

#### Expo plugin

For convinience here is a Expo plugin add import and headers into `AppDelegate.mm`. 

```js
// app.json
{
 expo: { //...
 },
 plugins: [
  ['./plugins/withPlugin.ts'],
],
}
```

```ts
// ./plugins/withPlugin.ts
import configPlugin, { ConfigPlugin } from '@expo/config-plugins'
import { AppDelegateProjectFile } from '@expo/config-plugins/build/ios/Paths'
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode'
import fs from 'fs'
const { IOSConfig, WarningAggregator, withDangerousMod } = configPlugin

function modifySwiftAppDelegate(contents: string): string {
    // Change following line to add your headers
    const methodInvocationBlock = `    MLRNCustomHeaders().initHeaders()
MLRNCustomHeaders().addHeader("very-long-srting", forHeaderName: "authorization")`
    const methodInvocationLineMatcher =
        /(?:self\.moduleName\s*=\s*"([^"]*)")|(?:factory\.startReactNative\()/

    // Add import
    if (!contents.includes('import maplibre_react_native')) {
        contents = contents.replace(
            /import Expo/g,
            `import Expo
import maplibre_react_native`,
        )
    }
    if (!methodInvocationLineMatcher.test(contents)) {
        WarningAggregator.addWarningIOS(
            '@react-native-firebase/app',
            'Unable to determine correct Firebase insertion point in AppDelegate.swift. Skipping Firebase addition.',
        )
        return contents
    }

    // Add invocation
    return mergeContents({
        tag: 'withPlugin',
        src: contents,
        newSrc: methodInvocationBlock,
        anchor: methodInvocationLineMatcher,
        offset: 0, // new line will be inserted right above matched anchor
        comment: '//',
    }).contents
}

async function modifyAppDelegateAsync(
    appDelegateFileInfo: AppDelegateProjectFile,
) {
    const { contents, path } = appDelegateFileInfo
    let newContents = modifySwiftAppDelegate(contents)
    await fs.promises.writeFile(path, newContents)
}

const withAppDelegate: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        'ios',
        async (config) => {
            const fileInfo = IOSConfig.Paths.getAppDelegate(
                config.modRequest.projectRoot,
            )
            await modifyAppDelegateAsync(fileInfo)
            return config
        },
    ])
}

const withPlugin: ConfigPlugin = (config) => {
    return withAppDelegate(config)
}

export default withPlugin
```

#### Swift `AppDelegate.mm`

```swift
import Expo
import maplibre_react_native // <- Add this import 
import FirebaseCore
import React
import ReactAppDependencyProvider

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

    MLRNCustomHeaders().initHeaders() // <- Add this line, followed be all headers
    MLRNCustomHeaders().addHeader("long-auth-string", forHeaderName: "authorization")

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

#### ObjectiveC `AppDelegate.m`
```objectivec
// (1) Include the header file
#import "MLRNCustomHeaders.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"SampleApp"
                                            initialProperties:nil];
  // (2) Init headers, add swizzle method
  [[MLRNCustomHeaders sharedInstance] initHeaders];
  // (3*) Optionally you can add some global headers here
  [[MLRNCustomHeaders sharedInstance] addHeader:@"IP" forHeaderName:@"X-For-Real"];

  ...
  return YES;
}

...

@end
```

## Sending custom HTTP Headers with the Tile Requests

You can configure sending of custom HTTP headers to your tile server. This is to support custom authentication or custom metadata which can't be included in the url.

You can add and remove headers at runtime.

### Adding a Header

```ts
addCustomHeader("Authorization", "{auth header}");
```

### Removing a Header

```ts
removeCustomHeader("Authorization");
```

### Working Example

```ts
function App() {
  useEffect(() => {
    addCustomHeader("Authorization", "{auth header}");
  }, []);

  addCustomHeader("X-Some-Header", "my-value");

  return <MapView style={{ flex: 1 }} />;
}
```
