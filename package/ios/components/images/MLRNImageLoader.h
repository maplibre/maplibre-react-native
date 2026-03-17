#import <MapLibre/MapLibre.h>
#import <React/RCTImageLoaderProtocol.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Singleton that exposes the image loader obtained from the TurboModule registry.
 */
@interface MLRNImageLoader : NSObject

+ (instancetype)sharedInstance;

@property (nonatomic, strong, nullable) id<RCTImageLoaderProtocol> imageLoader;

+ (void)fetchImage:(NSString *)url
             scale:(double)scale
               sdf:(BOOL)sdf
          callback:(RCTImageLoaderCompletionBlock)callback;

+ (void)fetchImages:(MLNStyle *)style
            objects:(NSDictionary<NSString *, id> *)objects
        forceUpdate:(BOOL)forceUpdate
           callback:(void (^)(void))callback;

@end

NS_ASSUME_NONNULL_END
