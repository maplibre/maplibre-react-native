#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNNetworkHTTPHeaders : NSObject <MLNNetworkConfigurationDelegate>

+ (id)sharedInstance;

- (void)addRequestHeader:(NSString *)value forHeaderName:(NSString *)header;

- (void)removeRequestHeader:(NSString *)header;

@end
