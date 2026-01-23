#import "MLRNLogging.h"

@import MapLibre;

@implementation MLRNLogging

+ (id)allocWithZone:(NSZone *)zone {
  static MLRNLogging *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
    self.loggingConfiguration = [MLNLoggingConfiguration sharedConfiguration];
    [self.loggingConfiguration setLoggingLevel:MLNLoggingLevelWarning];
    __weak typeof(self) weakSelf = self;
    self.loggingConfiguration.handler =
        ^(MLNLoggingLevel loggingLevel, NSString *filePath, NSUInteger line, NSString *message) {
          [weakSelf sendLogWithLevel:loggingLevel filePath:filePath line:line message:message];
        };
  }
  return self;
}

- (void)sendLogWithLevel:(MLNLoggingLevel)loggingLevel
                filePath:(NSString *)filePath
                    line:(NSUInteger)line
                 message:(NSString *)message {
  NSString *level = @"unknown";
  switch (loggingLevel) {
    case MLNLoggingLevelNone:
      level = @"none";
      break;
    case MLNLoggingLevelFault:
      level = @"fault";
      break;
    case MLNLoggingLevelError:
      level = @"error";
      break;
    case MLNLoggingLevelWarning:
      level = @"warn";
      break;
    case MLNLoggingLevelInfo:
      level = @"info";
      break;
#if MLN_LOGGING_ENABLE_DEBUG
    case MLNLoggingLevelDebug:
      level = @"debug";
      break;
#endif
    case MLNLoggingLevelVerbose:
      level = @"verbose";
      break;
  }

  if (self.delegate) {
    [self.delegate logging:self
        didReceiveLogWithLevel:level
                      filePath:filePath
                          line:line
                       message:message];
  }
}

- (void)setLogLevel:(nonnull NSString *)logLevel {
  MLNLoggingLevel mlnLogLevel = MLNLoggingLevelNone;
  if ([logLevel isEqualToString:@"none"]) {
    mlnLogLevel = MLNLoggingLevelNone;
  } else if ([logLevel isEqualToString:@"fault"]) {
    mlnLogLevel = MLNLoggingLevelFault;
  } else if ([logLevel isEqualToString:@"error"]) {
    mlnLogLevel = MLNLoggingLevelError;
  } else if ([logLevel isEqualToString:@"warn"]) {
    mlnLogLevel = MLNLoggingLevelWarning;
  } else if ([logLevel isEqualToString:@"info"]) {
    mlnLogLevel = MLNLoggingLevelInfo;
  } else if ([logLevel isEqualToString:@"debug"]) {
#if MLN_LOGGING_ENABLE_DEBUG
    mlnLogLevel = MLNLoggingLevelDebug;
#else
    mlnLogLevel = MLNLoggingLevelVerbose;
#endif
  } else if ([logLevel isEqualToString:@"verbose"]) {
    mlnLogLevel = MLNLoggingLevelVerbose;
  }

  [self.loggingConfiguration setLoggingLevel:mlnLogLevel];
}

@end
