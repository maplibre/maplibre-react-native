#import <Foundation/Foundation.h>
#import <MapLibre/MLNNetworkConfiguration.h>

@interface MLRNTransformRequest : NSObject <MLNNetworkConfigurationDelegate>

+ (MLRNTransformRequest *_Nonnull)sharedInstance;

@property (nonatomic, copy, nullable) void (^logCallback)
    (NSString *_Nonnull level, NSString *_Nonnull tag, NSString *_Nonnull message);

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

- (void)clearUrlSearchParams;

- (void)addHeader:(nonnull NSString *)transformId
            match:(nullable NSString *)match
             name:(nonnull NSString *)name
            value:(nonnull NSString *)value;

- (void)removeHeader:(nonnull NSString *)transformId;

- (void)clearHeaders;

@end
