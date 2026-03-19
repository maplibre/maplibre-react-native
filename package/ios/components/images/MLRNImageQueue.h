#import <Foundation/Foundation.h>
#import <React/RCTImageLoaderProtocol.h>

@interface MLRNImageQueue : NSObject

+ (instancetype)sharedInstance;

- (void)cancelAllOperations;
- (void)addImage:(NSString *)imageURL
                scale:(double)scale
                  sdf:(Boolean)sdf
          imageLoader:(id<RCTImageLoaderProtocol>)imageLoader
    completionHandler:(RCTImageLoaderCompletionBlock)handler;

@end
