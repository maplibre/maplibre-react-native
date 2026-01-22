#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNNetworkHTTPHeaders : NSObject <MLNNetworkConfigurationDelegate>

+ (id)sharedInstance;

- (void)addRequestHeader:(NSString *)name
                   value:(NSString *)value
                   match:(nullable NSString *)match;

- (void)removeRequestHeader:(NSString *)header;

@end
