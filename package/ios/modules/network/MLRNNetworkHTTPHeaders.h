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

@end
