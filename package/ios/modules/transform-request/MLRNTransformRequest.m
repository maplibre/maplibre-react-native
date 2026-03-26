#import "MLRNTransformRequest.h"
#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>

// ─── UrlTransformConfig ──────────────────────────────────────────────────────

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

// ─── UrlParamConfig ───────────────────────────────────────────────────────────

@interface UrlParamConfig : NSObject
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *value;
@property (nonatomic, strong, nullable) NSRegularExpression *matchRegex;

- (instancetype)initWithMatch:(nullable NSString *)match
                         name:(nonnull NSString *)name
                        value:(nonnull NSString *)value;
@end

@implementation UrlParamConfig

- (instancetype)initWithMatch:(nullable NSString *)match
                         name:(nonnull NSString *)name
                        value:(nonnull NSString *)value {
  if (self = [super init]) {
    _name = name;
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

@interface UrlParamEntry : NSObject
@property (nonatomic, copy) NSString *transformId;
@property (nonatomic, strong) UrlParamConfig *config;
@end

@implementation UrlParamEntry
@end

// ─── HeaderConfig ─────────────────────────────────────────────────────────────

@interface HeaderConfig : NSObject
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *value;
@property (nonatomic, strong, nullable) NSRegularExpression *matchRegex;

- (instancetype)initWithMatch:(nullable NSString *)match
                         name:(nonnull NSString *)name
                        value:(nonnull NSString *)value;
@end

@implementation HeaderConfig

- (instancetype)initWithMatch:(nullable NSString *)match
                         name:(nonnull NSString *)name
                        value:(nonnull NSString *)value {
  if (self = [super init]) {
    _name = name;
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

@interface HeaderEntry : NSObject
@property (nonatomic, copy) NSString *transformId;
@property (nonatomic, strong) HeaderConfig *config;
@end

@implementation HeaderEntry
@end

// ─── MLRNTransformRequest ─────────────────────────────────────────────────────

@implementation MLRNTransformRequest {
  NSMutableArray<UrlTransformEntry *> *urlTransforms;
  NSMutableArray<UrlParamEntry *> *urlParams;
  NSMutableArray<HeaderEntry *> *requestHeaders;
}

- (instancetype)init {
  if (self = [super init]) {
    urlTransforms = [[NSMutableArray alloc] init];
    urlParams = [[NSMutableArray alloc] init];
    requestHeaders = [[NSMutableArray alloc] init];
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

// ─── URL Transforms ───────────────────────────────────────────────────────────

- (void)addUrlTransform:(NSString *)transformId
                  match:(nullable NSString *)match
                   find:(NSString *)find
                replace:(NSString *)replace {
  NSError *error = nil;
  NSRegularExpression *findRegex = [NSRegularExpression regularExpressionWithPattern:find
                                                                             options:0
                                                                               error:&error];
  if (error != nil || findRegex == nil) {
    NSLog(@"[MLRNTransformRequest] addUrlTransform '%@': invalid find regex '%@': %@", transformId,
          find, error.localizedDescription);
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

// ─── URL Search Params ────────────────────────────────────────────────────────

- (void)addUrlSearchParam:(NSString *)transformId
                    match:(nullable NSString *)match
                     name:(NSString *)name
                    value:(NSString *)value {
  UrlParamConfig *config = [[UrlParamConfig alloc] initWithMatch:match name:name value:value];

  // Update in-place when the id already exists — preserves order
  for (UrlParamEntry *entry in urlParams) {
    if ([entry.transformId isEqualToString:transformId]) {
      entry.config = config;
      return;
    }
  }

  UrlParamEntry *entry = [[UrlParamEntry alloc] init];
  entry.transformId = transformId;
  entry.config = config;
  [urlParams addObject:entry];
}

- (void)removeUrlSearchParam:(NSString *)transformId {
  NSUInteger idx =
      [urlParams indexOfObjectPassingTest:^BOOL(UrlParamEntry *e, NSUInteger i, BOOL *stop) {
        return [e.transformId isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [urlParams removeObjectAtIndex:idx];
  }
}

// ─── Headers ──────────────────────────────────────────────────────────────────

- (void)addHeader:(NSString *)transformId
            match:(nullable NSString *)match
             name:(NSString *)name
            value:(NSString *)value {
  HeaderConfig *config = [[HeaderConfig alloc] initWithMatch:match name:name value:value];

  // Update in-place when the id already exists — preserves order
  for (HeaderEntry *entry in requestHeaders) {
    if ([entry.transformId isEqualToString:transformId]) {
      entry.config = config;
      return;
    }
  }

  HeaderEntry *entry = [[HeaderEntry alloc] init];
  entry.transformId = transformId;
  entry.config = config;
  [requestHeaders addObject:entry];
}

- (void)removeHeader:(NSString *)transformId {
  NSUInteger idx =
      [requestHeaders indexOfObjectPassingTest:^BOOL(HeaderEntry *e, NSUInteger i, BOOL *stop) {
        return [e.transformId isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [requestHeaders removeObjectAtIndex:idx];
  }
}

#pragma mark - MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  // ── 1. URL transforms ──────────────────────────────────────────────────────
  // Pipeline in insertion order — each rule receives the URL left by the previous rule.
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

  // ── 2. URL search params ───────────────────────────────────────────────────
  NSArray<UrlParamEntry *> *currentParams = [urlParams copy];
  if (currentParams.count > 0) {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:request.URL
                                                resolvingAgainstBaseURL:NO];
    NSMutableArray<NSURLQueryItem *> *queryItems =
        [NSMutableArray arrayWithArray:urlComponents.queryItems ?: @[]];

    for (UrlParamEntry *paramEntry in currentParams) {
      UrlParamConfig *config = paramEntry.config;
      BOOL shouldApply = YES;

      if (config.matchRegex != nil) {
        NSRange range =
            [config.matchRegex rangeOfFirstMatchInString:requestUrl
                                                 options:0
                                                   range:NSMakeRange(0, requestUrl.length)];
        shouldApply = (range.location != NSNotFound);
      }

      if (shouldApply) {
        [queryItems addObject:[NSURLQueryItem queryItemWithName:config.name value:config.value]];
      }
    }

    urlComponents.queryItems = queryItems;
    if (urlComponents.URL != nil) {
      [request setURL:urlComponents.URL];
    }
  }

  // ── 3. Headers ────────────────────────────────────────────────────────────
  NSArray<HeaderEntry *> *currentHeaders = [requestHeaders copy];
  if (currentHeaders.count > 0) {
    for (HeaderEntry *headerEntry in currentHeaders) {
      HeaderConfig *config = headerEntry.config;
      BOOL shouldApply = YES;

      if (config.matchRegex != nil) {
        NSRange range =
            [config.matchRegex rangeOfFirstMatchInString:requestUrl
                                                 options:0
                                                   range:NSMakeRange(0, requestUrl.length)];
        shouldApply = (range.location != NSNotFound);
      }

      if (shouldApply) {
        [request setValue:config.value forHTTPHeaderField:config.name];
      }
    }
  }

  return request;
}

@end
