#import "MLRNNetworkHTTPHeaders.h"
#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>

@implementation MLRNNetworkHTTPHeaders {
  NSMutableDictionary<NSString *, NSString *> *requestHeaders;
}

- (instancetype)init {
  if (self = [super init]) {
    requestHeaders = [[NSMutableDictionary alloc] init];
    [[MLNNetworkConfiguration sharedManager] setDelegate:self];
  }

  return self;
}

+ (id)sharedInstance {
  static MLRNNetworkHTTPHeaders *networkHttpHeaders;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    networkHttpHeaders = [[self alloc] init];
  });

  return networkHttpHeaders;
}

- (void)addRequestHeader:(NSString *)value forHeaderName:(NSString *)headerName {
  [requestHeaders setObject:value forKey:headerName];
}

- (void)removeRequestHeader:(NSString *)header {
  [requestHeaders removeObjectForKey:header];
}

#pragma mark - MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  NSDictionary<NSString *, NSString *> *currentHeaders = [requestHeaders copy];

  if (currentHeaders != nil && [currentHeaders count] > 0) {
    for (NSString *headerName in currentHeaders) {
      NSString *headerValue = currentHeaders[headerName];

      [request setValue:headerValue forHTTPHeaderField:headerName];
    }
  }

  return request;
}

@end
