#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNRequestHeaders : NSObject <MLNNetworkConfigurationDelegate>

+ (id)sharedInstance;

- (void)addHeader:(NSString *)value forHeaderName:(NSString *)header;

- (void)removeHeader:(NSString *)header;

@end
