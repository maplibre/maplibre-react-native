#ifndef RCTMGLLogging_h
#define RCTMGLLogging_h

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>


@class MLNLoggingConfiguration;

@interface RCTMGLLogging : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, nonnull) MLNLoggingConfiguration*  loggingConfiguration;

- (void)setLoggingLevel:(nonnull NSString*) logLevel;

@end

#endif /* RCTMGLLogging_h */
