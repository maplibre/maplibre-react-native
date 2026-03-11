#import <React/RCTBridgeModule.h>
#import <React/RCTImageLoaderProtocol.h>

NS_ASSUME_NONNULL_BEGIN

@interface MLRNImagesModule : NSObject <RCTBridgeModule>

+ (instancetype)sharedInstance;

@property (nonatomic, readonly) id<RCTImageLoaderProtocol> imageLoader;

@end

NS_ASSUME_NONNULL_END
