#import "RCTMGLLogging.h"

@import MapLibre;

@interface RCTMGLLogging()
@property (nonatomic) BOOL hasListeners;
@end

@implementation RCTMGLLogging

+ (id)allocWithZone:(NSZone *)zone {
    static RCTMGLLogging *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

-(id)init {
    if ( self = [super init] ) {
        self.loggingConfiguration = [MLNLoggingConfiguration sharedConfiguration];
        [self.loggingConfiguration  setLoggingLevel:MLNLoggingLevelWarning];
        __weak typeof(self) weakSelf = self;
        self.loggingConfiguration.handler = ^(MLNLoggingLevel loggingLevel, NSString *filePath, NSUInteger line, NSString *message) {
            [weakSelf sendLogWithLevel:loggingLevel filePath: filePath line: line message: message];
        };
    }
    return self;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"LogEvent"];
}

- (void)startObserving
{
    [super startObserving];
    self.hasListeners = true;
}

- (void)stopObserving
{
    [super stopObserving];
    self.hasListeners = false;
}

- (void)sendLogWithLevel:(MLNLoggingLevel)loggingLevel filePath:(NSString*)filePath line:(NSUInteger)line message:(NSString*)message
{
    if (!self.hasListeners) return;

    NSString* level = @"n/a";
    switch (loggingLevel) {
    case MLNLoggingLevelInfo:
        level = @"info";
        break;
    case MLNLoggingLevelError:
        level = @"error";
        break;
#if MGL_LOGGING_ENABLE_DEBUG
    case MGLLoggingLevelDebug:
        level = @"debug";
        break;
#endif
    case MLNLoggingLevelWarning:
        level = @"warning";
        break;
    case MLNLoggingLevelNone:
        level = @"none";
        break;
    case MLNLoggingLevelFault:
        level = @"fault";
        break;
    case MLNLoggingLevelVerbose:
        level = @"verbose";
        break;
    }

    NSString* type = nil;
    if ([message hasPrefix:@"Failed to load glyph range"]) {
        type = @"missing_font";
    }

    NSMutableDictionary* body = [@{
        @"level": level,
        @"message": message,
        @"filePath": filePath,
        @"line": @(line)
    } mutableCopy];

    if (type != nil) {
        body[@"type"] = type;
    }
    [self sendEventWithName:@"LogEvent" body:body];
}

RCT_EXPORT_METHOD(setLogLevel: (nonnull NSString*)logLevel)
{
    MLNLoggingLevel mglLogLevel = MLNLoggingLevelNone;
    if ([logLevel isEqualToString:@"none"]) {
        mglLogLevel = MLNLoggingLevelNone;
    } else if ([logLevel isEqualToString:@"debug"]) {
        mglLogLevel = MLNLoggingLevelInfo;
    } else if ([logLevel isEqualToString:@"fault"]) {
        mglLogLevel = MLNLoggingLevelFault;
    } else if ([logLevel isEqualToString:@"error"]) {
        mglLogLevel = MLNLoggingLevelError;
    } else if ([logLevel isEqualToString:@"warning"]) {
        mglLogLevel = MLNLoggingLevelWarning;
    } else if ([logLevel isEqualToString:@"info"]) {
        mglLogLevel = MLNLoggingLevelInfo;
    } else if ([logLevel isEqualToString:@"debug"]) {
#if MGL_LOGGING_ENABLE_DEBUG
        mglLogLevel = MGLLoggingLevelDebug;
#else
        mglLogLevel = MLNLoggingLevelVerbose;
#endif
    } else if ([logLevel isEqualToString:@"verbose"]) {
        mglLogLevel = MLNLoggingLevelVerbose;
    }
    self.loggingConfiguration.loggingLevel = mglLogLevel;
}

@end
