#import "MLRNTransformRequestModule.h"
#import "MLRNLogging.h"
#import "MLRNTransformRequest.h"

@implementation MLRNTransformRequestModule

+ (NSString *)moduleName {
  return @"MLRNTransformRequestModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeTransformRequestModuleSpecJSI>(params);
}

- (instancetype)init {
  if (self = [super init]) {
    MLRNLogging *logging = [[MLRNLogging alloc] init];
    [MLRNTransformRequest sharedInstance].logCallback =
        ^(NSString *level, NSString *tag, NSString *message) {
          [logging forwardLog:level tag:tag message:message];
        };
  }
  return self;
}

- (void)addUrlTransform:(NSString *)id
                  match:(NSString *_Nullable)match
                   find:(NSString *)find
                replace:(NSString *)replace {
  [MLRNTransformRequest.sharedInstance addUrlTransform:id match:match find:find replace:replace];
}

- (void)removeUrlTransform:(NSString *)id {
  [MLRNTransformRequest.sharedInstance removeUrlTransform:id];
}

- (void)clearUrlTransforms {
  [MLRNTransformRequest.sharedInstance clearUrlTransforms];
}

- (void)addUrlSearchParam:(NSString *)id
                    match:(NSString *_Nullable)match
                     name:(NSString *)name
                    value:(NSString *)value {
  [MLRNTransformRequest.sharedInstance addUrlSearchParam:id match:match name:name value:value];
}

- (void)removeUrlSearchParam:(NSString *)id {
  [MLRNTransformRequest.sharedInstance removeUrlSearchParam:id];
}

- (void)clearUrlSearchParams {
  [MLRNTransformRequest.sharedInstance clearUrlSearchParams];
}

- (void)addHeader:(NSString *)id
            match:(NSString *_Nullable)match
             name:(NSString *)name
            value:(NSString *)value {
  [MLRNTransformRequest.sharedInstance addHeader:id match:match name:name value:value];
}

- (void)removeHeader:(NSString *)id {
  [MLRNTransformRequest.sharedInstance removeHeader:id];
}

- (void)clearHeaders {
  [MLRNTransformRequest.sharedInstance clearHeaders];
}

@end
