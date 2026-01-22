#import <objc/runtime.h>

#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>
#import "MLRNRequestHeaders.h"

@implementation NSMutableURLRequest (RequestHeaders)

+ (NSMutableURLRequest *)__swizzle_requestWithURL:(NSURL *)url {
  if ([url.scheme isEqualToString:@"ws"]) {
    return [NSMutableURLRequest __swizzle_requestWithURL:url];
  }

  NSArray<NSString *> *stack = [NSThread callStackSymbols];
  if ([stack count] < 2) {
    return [NSMutableURLRequest __swizzle_requestWithURL:url];
  }

  if ([stack[1] containsString:@"MapLibre"] == NO) {
    return [NSMutableURLRequest __swizzle_requestWithURL:url];
  }

  NSMutableURLRequest *req = [NSMutableURLRequest __swizzle_requestWithURL:url];
  NSDictionary<NSString *, NSString *> *currentHeaders =
      [[[MLRNRequestHeaders sharedInstance] currentHeaders] copy];
  if (currentHeaders != nil && [currentHeaders count] > 0) {
    NSLog(@"[MLRNRequestHeaders] Adding headers to request: %@", url.absoluteString);
    for (NSString *headerName in currentHeaders) {
      id headerValue = currentHeaders[headerName];
      NSLog(@"[MLRNRequestHeaders]   - %@: %@", headerName, headerValue);
      [req setValue:headerValue forHTTPHeaderField:headerName];
    }
  }
  return req;
}

@end

@implementation MLRNRequestHeaders {
  NSMutableDictionary<NSString *, NSString *> *_currentHeaders;
  BOOL initialized;
}

+ (id)sharedInstance {
  static MLRNRequestHeaders *requestHeaders;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    requestHeaders = [[self alloc] init];
  });
  return requestHeaders;
}

// This replaces the [NSMutableURLRequest requestWithURL:] with custom implementation which
// adds runtime headers copied from [MLRNRequestHeaders _currentHeaders]
- (void)initialize {
  if (initialized) {
    return;
  }

  initialized = YES;
  NSLog(@"[MLRNRequestHeaders] Initializing by replacing [NSMutableURLRequest requestWithURL]");
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class targetClass = [NSMutableURLRequest class];
    Method oldMethod = class_getClassMethod(targetClass, @selector(requestWithURL:));
    Method newMethod = class_getClassMethod(targetClass, @selector(__swizzle_requestWithURL:));
    method_exchangeImplementations(oldMethod, newMethod);
  });
}

- (instancetype)init {
  if (self = [super init]) {
    _currentHeaders = [[NSMutableDictionary alloc] init];
    initialized = NO;
  }
  return self;
}

- (void)addHeader:(NSString *)value forHeaderName:(NSString *)headerName {
  if (!initialized) {
    [self initialize];
  }

  NSLog(@"[MLRNRequestHeaders] addHeader called: %@ = %@", headerName, value);
  [_currentHeaders setObject:value forKey:headerName];
  [[[MLNNetworkConfiguration sharedManager] sessionConfiguration]
      setHTTPAdditionalHeaders:_currentHeaders];
}

- (void)removeHeader:(NSString *)header {
  if (!initialized) {
    return;
  }

  [_currentHeaders removeObjectForKey:header];
}

@end
