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

- (void)addUrlSearchParam:(nonnull NSString *)key
                    value:(nonnull NSString *)value
                    match:(nullable NSString *)match;

- (void)removeUrlSearchParam:(nonnull NSString *)key;

- (void)addHeader:(nonnull NSString *)name
            value:(nonnull NSString *)value
            match:(nullable NSString *)match;

- (void)removeHeader:(nonnull NSString *)header;

@end
