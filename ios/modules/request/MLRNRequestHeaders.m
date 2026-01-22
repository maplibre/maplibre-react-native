#import "MLRNRequestHeaders.h"
#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>

@implementation MLRNRequestHeaders {
  NSMutableDictionary<NSString *, NSString *> *_currentHeaders;
}

- (instancetype)init {
  if (self = [super init]) {
    _currentHeaders = [[NSMutableDictionary alloc] init];
    [[MLNNetworkConfiguration sharedManager] setDelegate:self];
  }

  return self;
}

+ (id)sharedInstance {
  static MLRNRequestHeaders *requestHeaders;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    requestHeaders = [[self alloc] init];
  });

  return requestHeaders;
}

- (void)addHeader:(NSString *)value forHeaderName:(NSString *)headerName {
  NSLog(@"[MLRNRequestHeaders] addHeader called: %@ = %@", headerName, value);
  [_currentHeaders setObject:value forKey:headerName];
}

- (void)removeHeader:(NSString *)header {
  NSLog(@"[MLRNRequestHeaders] removeHeader called: %@", header);
  [_currentHeaders removeObjectForKey:header];
}

#pragma mark - MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  NSDictionary<NSString *, NSString *> *currentHeaders = [_currentHeaders copy];

  if (currentHeaders != nil && [currentHeaders count] > 0) {
    NSLog(@"[MLRNRequestHeaders] Adding headers to request: %@", request.URL.absoluteString);
    for (NSString *headerName in currentHeaders) {
      NSString *headerValue = currentHeaders[headerName];
      NSLog(@"[MLRNRequestHeaders]   - %@: %@", headerName, headerValue);
      [request setValue:headerValue forHTTPHeaderField:headerName];
    }
  }

  return request;
}

@end
