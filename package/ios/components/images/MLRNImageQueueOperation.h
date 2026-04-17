#import <React/RCTImageLoaderProtocol.h>

@interface MLRNImageQueueOperation : NSBlockOperation

@property (nonatomic, weak) id<RCTImageLoaderProtocol> imageLoader;
@property (nonatomic, copy) RCTImageLoaderCompletionBlock completionHandler;
@property (nonatomic, copy) NSURLRequest *urlRequest;
@property (nonatomic) Boolean sdf;
@property (nonatomic) double scale;

@end
