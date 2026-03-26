#import "MLRNTransformRequest.h"
#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>

// MARK: TransformConfig

@interface TransformConfig : NSObject
@property (nonatomic, copy) NSString *id;
@property (nonatomic, strong, nullable) NSRegularExpression *match;

- (instancetype)initWithId:(nonnull NSString *)id match:(nullable NSString *)match;
@end

@implementation TransformConfig

- (instancetype)initWithId:(nonnull NSString *)id match:(nullable NSString *)match {
  if (self = [super init]) {
    _id = id;

    if (match != nil) {
      NSError *error = nil;
      _match = [NSRegularExpression regularExpressionWithPattern:match options:0 error:&error];
      if (error != nil) {
        NSLog(@"[MLRNTransformRequest] Invalid match regex pattern '%@': %@", match,
              error.localizedDescription);
        return nil;
      }
    }
  }

  return self;
}

@end

// MARK: UrlTransformConfig

@interface UrlTransformConfig : TransformConfig
@property (nonatomic, strong) NSRegularExpression *find;
@property (nonatomic, strong) NSString *replace;

- (instancetype)initWithId:(nonnull NSString *)id
                     match:(nullable NSString *)match
                      find:(nonnull NSString *)find
                   replace:(nonnull NSString *)replace;
@end

@implementation UrlTransformConfig

- (instancetype)initWithId:(nonnull NSString *)id
                     match:(nullable NSString *)match
                      find:(nonnull NSString *)find
                   replace:(nonnull NSString *)replace {
  if (self = [super initWithId:id match:match]) {
    NSError *error = nil;
    _find = [NSRegularExpression regularExpressionWithPattern:find options:0 error:&error];
    if (error != nil || _find == nil) {
      NSLog(@"[MLRNTransformRequest] addUrlTransform '%@': invalid find regex '%@': %@", id, find,
            error.localizedDescription);
      return nil;
    }
    _replace = replace;
  }

  return self;
}

@end

// MARK: UrlSearchParamConfig

@interface UrlSearchParamConfig : TransformConfig
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *value;

- (instancetype)initWithId:(nonnull NSString *)transformId
                     match:(nullable NSString *)match
                      name:(nonnull NSString *)name
                     value:(nonnull NSString *)value;
@end

@implementation UrlSearchParamConfig

- (instancetype)initWithId:(nonnull NSString *)id
                     match:(nullable NSString *)match
                      name:(nonnull NSString *)name
                     value:(nonnull NSString *)value {
  if (self = [super initWithId:id match:match]) {
    _name = name;
    _value = value;
  }

  return self;
}

@end

// MARK: HeaderConfig

@interface HeaderConfig : TransformConfig
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *value;

- (instancetype)initWithId:(nonnull NSString *)transformId
                     match:(nullable NSString *)match
                      name:(nonnull NSString *)name
                     value:(nonnull NSString *)value;
@end

@implementation HeaderConfig

- (instancetype)initWithId:(nonnull NSString *)transformId
                     match:(nullable NSString *)match
                      name:(nonnull NSString *)name
                     value:(nonnull NSString *)value {
  if (self = [super initWithId:transformId match:match]) {
    _name = name;
    _value = value;
  }

  return self;
}

@end

// MARK: MLRNTransformRequest

@implementation MLRNTransformRequest {
  NSMutableArray<UrlTransformConfig *> *urlTransforms;
  NSMutableArray<UrlSearchParamConfig *> *urlSearchParams;
  NSMutableArray<HeaderConfig *> *headers;
}

- (instancetype)init {
  if (self = [super init]) {
    urlTransforms = [[NSMutableArray alloc] init];
    urlSearchParams = [[NSMutableArray alloc] init];
    headers = [[NSMutableArray alloc] init];
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

// MARK: URL Transforms

- (void)addUrlTransform:(NSString *)transformId
                  match:(nullable NSString *)match
                   find:(NSString *)find
                replace:(NSString *)replace {
  UrlTransformConfig *config = [[UrlTransformConfig alloc] initWithId:transformId
                                                                match:match
                                                                 find:find
                                                              replace:replace];
  if (config == nil) {
    return;
  }

  for (UrlTransformConfig *existing in urlTransforms) {
    if ([existing.id isEqualToString:transformId]) {
      NSUInteger idx = [urlTransforms indexOfObject:existing];
      [urlTransforms replaceObjectAtIndex:idx withObject:config];
      return;
    }
  }

  [urlTransforms addObject:config];
}

- (void)removeUrlTransform:(NSString *)transformId {
  NSUInteger idx = [urlTransforms
      indexOfObjectPassingTest:^BOOL(UrlTransformConfig *c, NSUInteger i, BOOL *stop) {
        return [c.id isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [urlTransforms removeObjectAtIndex:idx];
  }
}

- (void)clearUrlTransforms {
  [urlTransforms removeAllObjects];
}

// MARK: URL Search Params

- (void)addUrlSearchParam:(NSString *)transformId
                    match:(nullable NSString *)match
                     name:(NSString *)name
                    value:(NSString *)value {
  UrlSearchParamConfig *config = [[UrlSearchParamConfig alloc] initWithId:transformId
                                                                    match:match
                                                                     name:name
                                                                    value:value];

  // Update in-place when the id already exists — preserves order
  for (UrlSearchParamConfig *existing in urlSearchParams) {
    if ([existing.id isEqualToString:transformId]) {
      NSUInteger idx = [urlSearchParams indexOfObject:existing];
      [urlSearchParams replaceObjectAtIndex:idx withObject:config];
      return;
    }
  }

  [urlSearchParams addObject:config];
}

- (void)removeUrlSearchParam:(NSString *)transformId {
  NSUInteger idx = [urlSearchParams
      indexOfObjectPassingTest:^BOOL(UrlSearchParamConfig *c, NSUInteger i, BOOL *stop) {
        return [c.id isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [urlSearchParams removeObjectAtIndex:idx];
  }
}

- (void)clearUrlSearchParams {
  [urlSearchParams removeAllObjects];
}

// MARK: Headers

- (void)addHeader:(NSString *)transformId
            match:(nullable NSString *)match
             name:(NSString *)name
            value:(NSString *)value {
  HeaderConfig *config = [[HeaderConfig alloc] initWithId:transformId
                                                    match:match
                                                     name:name
                                                    value:value];

  for (HeaderConfig *existing in headers) {
    if ([existing.id isEqualToString:transformId]) {
      NSUInteger idx = [headers indexOfObject:existing];
      [headers replaceObjectAtIndex:idx withObject:config];
      return;
    }
  }

  [headers addObject:config];
}

- (void)removeHeader:(NSString *)transformId {
  NSUInteger idx =
      [headers indexOfObjectPassingTest:^BOOL(HeaderConfig *c, NSUInteger i, BOOL *stop) {
        return [c.id isEqualToString:transformId];
      }];
  if (idx != NSNotFound) {
    [headers removeObjectAtIndex:idx];
  }
}

- (void)clearHeaders {
  [headers removeAllObjects];
}

// MARK: MLNNetworkConfigurationDelegate

- (NSMutableURLRequest *)willSendRequest:(NSMutableURLRequest *)request {
  // 1. URL transforms
  NSArray<UrlTransformConfig *> *currentTransforms = [urlTransforms copy];
  for (UrlTransformConfig *config in currentTransforms) {
    NSString *currentUrl = request.URL.absoluteString;

    if (config.match != nil) {
      NSRange r = [config.match rangeOfFirstMatchInString:currentUrl
                                                  options:0
                                                    range:NSMakeRange(0, currentUrl.length)];
      if (r.location == NSNotFound) {
        continue;
      }
    }

    NSString *transformed =
        [config.find stringByReplacingMatchesInString:currentUrl
                                              options:0
                                                range:NSMakeRange(0, currentUrl.length)
                                         withTemplate:config.replace];
    NSURL *newURL = [NSURL URLWithString:transformed];
    if (newURL == nil) {
      NSLog(@"[MLRNTransformRequest] URL transform '%@' produced invalid URL '%@', "
            @"using pre-transform URL",
            config.id, transformed);
    } else {
      [request setURL:newURL];
    }
  }

  // 2. URL search params
  NSArray<UrlSearchParamConfig *> *currentParams = [urlSearchParams copy];
  if (currentParams.count > 0) {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:request.URL
                                                resolvingAgainstBaseURL:NO];
    NSMutableArray<NSURLQueryItem *> *queryItems =
        [NSMutableArray arrayWithArray:urlComponents.queryItems ?: @[]];

    for (UrlSearchParamConfig *config in currentParams) {
      BOOL shouldApply = YES;

      if (config.match != nil) {
        NSRange range = [config.match rangeOfFirstMatchInString:request.URL.absoluteString
                                                        options:0
                                                          range:NSMakeRange(0, request.URL.absoluteString.length)];
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

  // 3. Headers
  NSArray<HeaderConfig *> *currentHeaders = [headers copy];
  if (currentHeaders.count > 0) {
    for (HeaderConfig *config in currentHeaders) {
      BOOL shouldApply = YES;

      if (config.match != nil) {
        NSRange range = [config.match rangeOfFirstMatchInString:request.URL.absoluteString
                                                        options:0
                                                          range:NSMakeRange(0, request.URL.absoluteString.length)];
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
