#import "MLRNNetworkHTTPHeaders.h"
#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>

@interface HeaderConfig : NSObject
@property (nonatomic, strong) NSString *value;
@property (nonatomic, strong, nullable) NSRegularExpression *matchRegex;

- (instancetype)initWithValue:(NSString *)value match:(nullable NSString *)match;
@end

@implementation HeaderConfig

- (instancetype)initWithValue:(NSString *)value match:(nullable NSString *)match {
  if (self = [super init]) {
    _value = value;

    if (match != nil) {
      NSError *error = nil;
      _matchRegex = [NSRegularExpression regularExpressionWithPattern:match options:0 error:&error];
      if (error != nil) {
        NSLog(@"[MLRNNetworkHTTPHeaders] Invalid regex pattern '%@': %@", match,
              error.localizedDescription);
        _matchRegex = nil;
      }
    } else {
      _matchRegex = nil;
    }
  }
  return self;
}

@end

@implementation MLRNNetworkHTTPHeaders {
  NSMutableDictionary<NSString *, HeaderConfig *> *requestHeaders;
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

- (void)addRequestHeader:(NSString *)name value:(NSString *)value match:(nullable NSString *)match {
  HeaderConfig *config = [[HeaderConfig alloc] initWithValue:value match:match];
  [requestHeaders setObject:config forKey:name];
}

- (void)removeRequestHeader:(NSString *)header {
  [requestHeaders removeObjectForKey:header];
}

#pragma mark - MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  NSDictionary<NSString *, HeaderConfig *> *currentHeaders = [requestHeaders copy];

  if (currentHeaders != nil && [currentHeaders count] > 0) {
    NSString *requestUrl = request.URL.absoluteString;

    for (NSString *headerName in currentHeaders) {
      HeaderConfig *config = currentHeaders[headerName];
      BOOL shouldApply = YES;

      if (config.matchRegex != nil) {
        NSRange range =
            [config.matchRegex rangeOfFirstMatchInString:requestUrl
                                                 options:0
                                                   range:NSMakeRange(0, requestUrl.length)];
        shouldApply = (range.location != NSNotFound);
      }

      if (shouldApply) {
        [request setValue:config.value forHTTPHeaderField:headerName];
      }
    }
  }

  return request;
}

@end
