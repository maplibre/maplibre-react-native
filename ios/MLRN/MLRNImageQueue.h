#import <Foundation/Foundation.h>
#import <React/RCTImageLoader.h>

@interface MLRNImageQueue : NSObject

+ (instancetype)sharedInstance;

- (void)cancelAllOperations;
- (void)addImage:(NSString *)imageURL
                scale:(double)scale
                sdf:(Boolean)sdf
               bridge:(RCTBridge *)bridge
    completionHandler:(RCTImageLoaderCompletionBlock)handler;

@end
