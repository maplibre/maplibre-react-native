#import <React/RCTImageLoaderProtocol.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Plain Objective-C singleton that exposes the image loader obtained from the
 * TurboModule registry.  MLRNImagesModule.mm (Objective-C++) sets the loader
 * after the TurboModule is initialised; MLRNImages.m (plain Objective-C) reads
 * it without ever touching C++ headers.
 */
@interface MLRNImagesProvider : NSObject

+ (instancetype)sharedInstance;

@property (nonatomic, strong, nullable) id<RCTImageLoaderProtocol> imageLoader;

@end

NS_ASSUME_NONNULL_END

