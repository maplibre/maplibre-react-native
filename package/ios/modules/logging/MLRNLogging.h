#import <Foundation/Foundation.h>

@class MLNLoggingConfiguration;

@protocol MLRNLoggingDelegate <NSObject>

- (void)logging:(nonnull id)logging
    didReceiveLogWithLevel:(nonnull NSString*)level

                  filePath:(nonnull NSString*)filePath
                      line:(NSUInteger)line
                   message:(nonnull NSString*)message;

@end

@interface MLRNLogging : NSObject

@property (nonatomic, nonnull) MLNLoggingConfiguration* loggingConfiguration;
@property (nonatomic, weak, nullable) id<MLRNLoggingDelegate> delegate;

- (void)setLogLevel:(nonnull NSString*)logLevel;

- (void)forwardLog:(nonnull NSString*)level
               tag:(nonnull NSString*)tag
           message:(nonnull NSString*)message;

@end
