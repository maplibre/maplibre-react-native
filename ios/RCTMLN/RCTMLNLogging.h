#ifndef RCTMLNLogging_h
#define RCTMLNLogging_h

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>


@class MLNLoggingConfiguration;

@interface RCTMLNLogging : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, nonnull) MLNLoggingConfiguration*  loggingConfiguration;

- (void)setLoggingLevel:(nonnull NSString*) logLevel;

@end

#endif /* RCTMLNLogging_h */
