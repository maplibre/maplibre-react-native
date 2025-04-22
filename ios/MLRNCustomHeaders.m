//
//  MLRNCustomHeaders.h
//  MLRN
//

#import <objc/runtime.h>

#import <MapLibre/MLNNetworkConfiguration.h>
#import <MapLibre/MapLibre.h>
#import "MLRNCustomHeaders.h"

@implementation NSMutableURLRequest (CustomHeaders)

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
      [[[MLRNCustomHeaders sharedInstance] currentHeaders] copy];
  if (currentHeaders != nil && [currentHeaders count] > 0) {
    for (NSString *headerName in currentHeaders) {
      id headerValue = currentHeaders[headerName];
      [req setValue:headerValue forHTTPHeaderField:headerName];
    }
  }
  return req;
}

@end

@implementation MLRNCustomHeaders {
  NSMutableDictionary<NSString *, NSString *> *_currentHeaders;
  BOOL areHeadersAdded;
}

+ (id)sharedInstance {
  static MLRNCustomHeaders *customHeaders;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    customHeaders = [[self alloc] init];
  });
  return customHeaders;
}

// This replaces the [NSMutableURLRequest requestWithURL:] with custom implementation which
// adds runtime headers copied from [MLRNCustomHeaders _currentHeaders]
- (void)initHeaders {
  if (!areHeadersAdded) {
    areHeadersAdded = YES;
    NSLog(@"Replace method [NSMutableURLRequest requestWithURL]");
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      Class targetClass = [NSMutableURLRequest class];
      Method oldMethod = class_getClassMethod(targetClass, @selector(requestWithURL:));
      Method newMethod = class_getClassMethod(targetClass, @selector(__swizzle_requestWithURL:));
      method_exchangeImplementations(oldMethod, newMethod);
    });
  }
}

- (instancetype)init {
  if (self = [super init]) {
    _currentHeaders = [[NSMutableDictionary alloc] init];
    areHeadersAdded = NO;
  }
  return self;
}

- (void)addHeader:(NSString *)value forHeaderName:(NSString *)headerName {
  if (!areHeadersAdded) {
    areHeadersAdded = YES;
  }

  [_currentHeaders setObject:value forKey:headerName];
  [[[MLNNetworkConfiguration sharedManager] sessionConfiguration]
      setHTTPAdditionalHeaders:_currentHeaders];
}

- (void)removeHeader:(NSString *)header {
  if (!areHeadersAdded) {
    return;
  }

  [_currentHeaders removeObjectForKey:header];
}

@end
