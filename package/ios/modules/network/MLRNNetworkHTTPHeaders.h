#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNNetworkHTTPHeaders : NSObject <MLNNetworkConfigurationDelegate>

+ (id _Nonnull)sharedInstance;

- (void)addRequestHeader:(nonnull NSString *)name
                   value:(nonnull NSString *)value
                   match:(nullable NSString *)match;

- (void)removeRequestHeader:(nonnull NSString *)header;

- (void)addUrlParam:(nonnull NSString *)key
              value:(nonnull NSString *)value
              match:(nullable NSString *)match;

- (void)removeUrlParam:(nonnull NSString *)key;

- (void)addUrlTransform:(nonnull NSString *)transformId
                  match:(nullable NSString *)match
                   find:(nonnull NSString *)find
                replace:(nonnull NSString *)replace;

- (void)removeUrlTransform:(nonnull NSString *)transformId;

- (void)clearUrlTransforms;

@end
