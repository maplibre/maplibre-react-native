#import "MLRNTransformRequestModule.h"
#import "MLRNTransformRequest.h"

@implementation MLRNTransformRequestModule

+ (NSString *)moduleName {
  return @"MLRNTransformRequestModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeTransformRequestModuleSpecJSI>(params);
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

- (void)addUrlSearchParam:(NSString *)name value:(NSString *)value match:(NSString *_Nullable)match {
  [MLRNTransformRequest.sharedInstance addUrlSearchParam:name value:value match:match];
}

- (void)removeUrlSearchParam:(NSString *)name {
  [MLRNTransformRequest.sharedInstance removeUrlSearchParam:name];
}

- (void)addHeader:(NSString *)name value:(NSString *)value match:(NSString *_Nullable)match {
  [MLRNTransformRequest.sharedInstance addHeader:name value:value match:match];
}

- (void)removeHeader:(NSString *)name {
  [MLRNTransformRequest.sharedInstance removeHeader:name];
}

@end
