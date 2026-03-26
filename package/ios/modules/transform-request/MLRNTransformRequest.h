#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNTransformRequest : NSObject <MLNNetworkConfigurationDelegate>

+ (id _Nonnull)sharedInstance;

- (void)addUrlTransform:(nonnull NSString *)transformId
                  match:(nullable NSString *)match
                   find:(nonnull NSString *)find
                replace:(nonnull NSString *)replace;

- (void)removeUrlTransform:(nonnull NSString *)transformId;

- (void)clearUrlTransforms;

- (void)addUrlSearchParam:(nonnull NSString *)transformId
                    match:(nullable NSString *)match
                     name:(nonnull NSString *)name
                    value:(nonnull NSString *)value;

- (void)removeUrlSearchParam:(nonnull NSString *)transformId;

- (void)addHeader:(nonnull NSString *)transformId
            match:(nullable NSString *)match
             name:(nonnull NSString *)name
            value:(nonnull NSString *)value;

- (void)removeHeader:(nonnull NSString *)transformId;

@end
