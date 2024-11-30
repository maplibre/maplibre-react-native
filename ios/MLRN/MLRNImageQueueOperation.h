#import <React/RCTImageLoader.h>

@interface MLRNImageQueueOperation : NSBlockOperation

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, copy) RCTImageLoaderCompletionBlock completionHandler;
@property (nonatomic, copy) NSURLRequest *urlRequest;
@property (nonatomic)       double scale;

@end
