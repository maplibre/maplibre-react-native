#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

@class MLNLoggingConfiguration;

@interface MLRNLogging : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, nonnull) MLNLoggingConfiguration* loggingConfiguration;

@end
