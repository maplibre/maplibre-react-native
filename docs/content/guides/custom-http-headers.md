# Custom HTTP Headers

## Intro

Custom headers are implemented using OkHttp interceptor for android and method swizzling for iOS.

[Method swizzling](https://en.wikipedia.org/wiki/Monkey_patch) is done on the `[NSMutableURLRequest requestWithURL:]` to allow adding headers during runtime.

## Prerequisites

### Android

None

### iOS

To enable this on iOS you need to call `[[MLRNCustomHeaders sharedInstance] initHeaders]` pretty early in the lifecycle of the application. This will swizzle the custom method.
Suggested location is `[AppDelegate application: didFinishLaunchingWithOptions:]`

### Working Example `AppDelegate.m`

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
