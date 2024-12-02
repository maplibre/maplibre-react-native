#import "MLRNImageQueue.h"
#import "MLRNImageQueueOperation.h"
#import "MLRNUtils.h"

@implementation MLRNImageQueue
{
    NSOperationQueue *imageQueue;
}

- (id)init
{
    if (self = [super init]) {
        imageQueue = [[NSOperationQueue alloc] init];
        imageQueue.name = @"org.maplibre.reactnative.DownloadImageQueue";
    }
    return self;
}

- (void)dealloc
{
    [self cancelAllOperations];
}

+ (instancetype)sharedInstance
{
    static MLRNImageQueue *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[MLRNImageQueue alloc] init];
    });
    return sharedInstance;
}

- (void)cancelAllOperations
{
    [imageQueue cancelAllOperations];
}

- (void)addImage:(NSString *)imageURL scale:(double)scale bridge:(RCTBridge *)bridge completionHandler:(RCTImageLoaderCompletionBlock)handler
{
    MLRNImageQueueOperation *operation = [[MLRNImageQueueOperation alloc] init];
    operation.bridge = bridge;
    operation.urlRequest = [RCTConvert NSURLRequest:imageURL];
    operation.completionHandler = handler;
    operation.scale = scale;
    [imageQueue addOperation:operation];
}

@end
