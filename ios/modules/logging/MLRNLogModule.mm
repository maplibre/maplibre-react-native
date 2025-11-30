#import "MLRNLogModule.h"

#import "MLRNLogging.h"

@implementation MLRNLogModule {
  MLRNLogging *logging;
}

+ (NSString *)moduleName {
  return @"MLRNLogModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLogModuleSpecJSI>(params);
}

- (instancetype)init {
  if (self = [super init]) {
    logging = [[MLRNLogging alloc] init];
    logging.delegate = self;
  }

  return self;
}

- (void)setLogLevel:(NSString *)logLevel {
  [logging setLogLevel:logLevel];
}

- (void)logging:(nonnull id)logging
    didReceiveLogWithLevel:(nonnull NSString *)level
                  filePath:(nonnull NSString *)filePath
                      line:(NSUInteger)line
                   message:(nonnull NSString *)message {
  [self emitOnLog:@{ @"level" : level, @"tag" : filePath, @"message" : message}];
}

@end
