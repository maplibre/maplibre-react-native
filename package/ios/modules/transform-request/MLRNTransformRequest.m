#import "MLRNTransformRequest.h"
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
        NSLog(@"[MLRNTransformRequest] Invalid regex pattern '%@': %@", match,
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

@interface UrlParamConfig : NSObject
@property (nonatomic, strong) NSString *value;
@property (nonatomic, strong, nullable) NSRegularExpression *matchRegex;

- (instancetype)initWithValue:(NSString *)value match:(nullable NSString *)match;
@end

@implementation UrlParamConfig

- (instancetype)initWithValue:(NSString *)value match:(nullable NSString *)match {
  if (self = [super init]) {
    _value = value;

    if (match != nil) {
      NSError *error = nil;
      _matchRegex = [NSRegularExpression regularExpressionWithPattern:match options:0 error:&error];
      if (error != nil) {
        NSLog(@"[MLRNTransformRequest] Invalid regex pattern '%@': %@", match,
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

@interface UrlTransformConfig : NSObject
@property (nonatomic, strong, nullable) NSRegularExpression *matchRegex;
@property (nonatomic, strong) NSRegularExpression *findRegex;
@property (nonatomic, strong) NSString *replaceTemplate;
@end

@implementation UrlTransformConfig
@end

@interface UrlTransformEntry : NSObject
@property (nonatomic, copy) NSString *transformId;
@property (nonatomic, strong) UrlTransformConfig *config;
@end

@implementation UrlTransformEntry
@end

@implementation MLRNTransformRequest {
  NSMutableDictionary<NSString *, HeaderConfig *> *requestHeaders;
  NSMutableDictionary<NSString *, UrlParamConfig *> *urlParams;
  NSMutableArray<UrlTransformEntry *> *urlTransforms;
}

- (instancetype)init {
  if (self = [super init]) {
    requestHeaders = [[NSMutableDictionary alloc] init];
    urlParams = [[NSMutableDictionary alloc] init];
    urlTransforms = [[NSMutableArray alloc] init];
    [[MLNNetworkConfiguration sharedManager] setDelegate:self];
  }

  return self;
}

+ (id)sharedInstance {
  static MLRNTransformRequest *transformRequest;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    transformRequest = [[self alloc] init];
  });

  return transformRequest;
}

- (void)addUrlTransform:(NSString *)transformId
                  match:(nullable NSString *)match
                   find:(NSString *)find
                replace:(NSString *)replace {
  NSError *error = nil;
  NSRegularExpression *findRegex = [NSRegularExpression regularExpressionWithPattern:find
                                                                             options:0
                                                                               error:&error];
  if (error != nil || findRegex == nil) {
    NSLog(@"[MLRNTransformRequest] addUrlTransform '%@': invalid find regex '%@': %@",
          transformId, find, error.localizedDescription);
    return;
  }

  NSRegularExpression *matchRegex = nil;
  if (match != nil) {
    NSError *matchError = nil;
    matchRegex = [NSRegularExpression regularExpressionWithPattern:match
                                                           options:0
                                                             error:&matchError];
    if (matchError != nil) {
      NSLog(@"[MLRNTransformRequest] addUrlTransform '%@': invalid match regex '%@': %@",
            transformId, match, matchError.localizedDescription);
      // matchRegex stays nil — rule applies to all URLs rather than being silently dropped
    }
  }

  UrlTransformConfig *config = [[UrlTransformConfig alloc] init];
  config.matchRegex = matchRegex;
  config.findRegex = findRegex;
  config.replaceTemplate = replace;

  // Update in-place when the id already exists — preserves pipeline position
  for (UrlTransformEntry *entry in urlTransforms) {
    if ([entry.transformId isEqualToString:transformId]) {
      entry.config = config;
      return;
    }
  }

  // New rule — append to end of pipeline
  UrlTransformEntry *entry = [[UrlTransformEntry alloc] init];
  entry.transformId = transformId;
  entry.config = config;
  [urlTransforms addObject:entry];
}

- (void)removeUrlTransform:(NSString *)transformId {
  NSUInteger idx = [urlTransforms
      indexOfObjectPassingTest:^BOOL(UrlTransformEntry *e, NSUInteger i, BOOL *stop) {
        return [e.transformId isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [urlTransforms removeObjectAtIndex:idx];
  }
}

- (void)clearUrlTransforms {
  [urlTransforms removeAllObjects];
}

- (void)addUrlSearchParam:(NSString *)key value:(NSString *)value match:(nullable NSString *)match {
  UrlParamConfig *config = [[UrlParamConfig alloc] initWithValue:value match:match];
  [urlParams setObject:config forKey:key];
}

- (void)removeUrlSearchParam:(NSString *)key {
  [urlParams removeObjectForKey:key];
}

- (void)addHeader:(NSString *)name value:(NSString *)value match:(nullable NSString *)match {
  HeaderConfig *config = [[HeaderConfig alloc] initWithValue:value match:match];
  [requestHeaders setObject:config forKey:name];
}

- (void)removeHeader:(NSString *)header {
  [requestHeaders removeObjectForKey:header];
}

#pragma mark - MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  // Apply URL transforms — pipeline in insertion order.
  // Each rule receives the URL as left by the previous rule.
  NSArray<UrlTransformEntry *> *currentTransforms = [urlTransforms copy];
  for (UrlTransformEntry *entry in currentTransforms) {
    NSString *currentUrl = request.URL.absoluteString;

    UrlTransformConfig *config = entry.config;

    if (config.matchRegex != nil) {
      NSRange r = [config.matchRegex rangeOfFirstMatchInString:currentUrl
                                                       options:0
                                                         range:NSMakeRange(0, currentUrl.length)];
      if (r.location == NSNotFound) {
        continue;
      }
    }

    NSString *transformed =
        [config.findRegex stringByReplacingMatchesInString:currentUrl
                                                   options:0
                                                     range:NSMakeRange(0, currentUrl.length)
                                              withTemplate:config.replaceTemplate];
    NSURL *newURL = [NSURL URLWithString:transformed];
    if (newURL == nil) {
      NSLog(@"[MLRNTransformRequest] URL transform '%@' produced invalid URL '%@', "
            @"using pre-transform URL",
            entry.transformId, transformed);
    } else {
      [request setURL:newURL];
    }
  }

  NSString *requestUrl = request.URL.absoluteString;

  // Apply URL params
  NSDictionary<NSString *, UrlParamConfig *> *currentParams = [urlParams copy];
  if (currentParams != nil && [currentParams count] > 0) {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:request.URL
                                                resolvingAgainstBaseURL:NO];
    NSMutableArray<NSURLQueryItem *> *queryItems =
        [NSMutableArray arrayWithArray:urlComponents.queryItems ?: @[]];

    for (NSString *paramKey in currentParams) {
      UrlParamConfig *config = currentParams[paramKey];
      BOOL shouldApply = YES;

      if (config.matchRegex != nil) {
        NSRange range =
            [config.matchRegex rangeOfFirstMatchInString:requestUrl
                                                 options:0
                                                   range:NSMakeRange(0, requestUrl.length)];
        shouldApply = (range.location != NSNotFound);
      }

      if (shouldApply) {
        [queryItems addObject:[NSURLQueryItem queryItemWithName:paramKey value:config.value]];
      }
    }

    urlComponents.queryItems = queryItems;
    if (urlComponents.URL != nil) {
      [request setURL:urlComponents.URL];
    }
  }

  // Apply headers
  NSDictionary<NSString *, HeaderConfig *> *currentHeaders = [requestHeaders copy];
  if (currentHeaders != nil && [currentHeaders count] > 0) {
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
