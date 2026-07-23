#import "MLRNImageQueueOperation.h"

#import <React/RCTImageLoader.h>

typedef NS_ENUM(NSInteger, MLRNImageQueueOperationState) {
  IOState_Initial,
  IOState_CancelledDoNotExecute,
  IOState_Executing,  // cancellationBlock is set
  IOState_Finished,

  /* Not sates, just selectors for only and except params */
  IOState_Filter_None,
  IOState_Filter_All,
};

@interface MLRNImageQueueOperation ()
@property (nonatomic) MLRNImageQueueOperationState state;
@end

@implementation MLRNImageQueueOperation {
  RCTImageLoaderCancellationBlock _cancellationBlock;
  BOOL _cancelled;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _state = IOState_Initial;
    _cancelled = false;
  }
  return self;
}

- (BOOL)isExecuting {
  @synchronized(self) {
    return self.state == IOState_Executing;
  }
}

- (BOOL)isFinished {
  @synchronized(self) {
    return (self.state == IOState_Finished || self.state == IOState_CancelledDoNotExecute);
  }
}

- (BOOL)isCancelled {
  @synchronized(self) {
    return self.state == IOState_CancelledDoNotExecute;
  }
}

- (BOOL)isAsynchronous {
  return YES;
}

- (void)setCancellationBlock:(dispatch_block_t)block {
  _cancellationBlock = block;
}

- (void)callCancellationBlock {
  if (_cancellationBlock) {
    _cancellationBlock();
  }
}

- (MLRNImageQueueOperationState)setState:(MLRNImageQueueOperationState)newState
                                    only:(MLRNImageQueueOperationState)only
                                  except:(MLRNImageQueueOperationState)except {
  MLRNImageQueueOperationState prevState = IOState_Filter_None;
  [self willChangeValueForKey:@"isExecuting"];
  [self willChangeValueForKey:@"isFinished"];
  [self willChangeValueForKey:@"isCancelled"];

  @synchronized(self) {
    BOOL allowed = YES;
    prevState = self.state;
    if (!(only == IOState_Filter_All || prevState == only)) {
      allowed = NO;
    }
    if (prevState == except) {
      allowed = NO;
    }
    if (allowed) {
      self.state = newState;
    }
  }
  [self didChangeValueForKey:@"isExecuting"];
  [self didChangeValueForKey:@"isFinished"];
  [self didChangeValueForKey:@"isCancelled"];
  return prevState;
}

- (MLRNImageQueueOperationState)setState:(MLRNImageQueueOperationState)newState
                                    only:(MLRNImageQueueOperationState)only {
  return [self setState:newState only:only except:IOState_Filter_None];
}

- (MLRNImageQueueOperationState)setState:(MLRNImageQueueOperationState)newState
                                  except:(MLRNImageQueueOperationState)except {
  return [self setState:newState only:IOState_Filter_All except:except];
}

- (void)start {
  if (self.state == IOState_CancelledDoNotExecute) {
    return;
  }

  MLRNImageQueueOperationState prevState = [self setState:IOState_Executing only:IOState_Initial];
  if (prevState != IOState_Initial) {
    return;
  }

  MLRNImageQueueOperation *strongSelf = self;
  // Serial queue: RCTImageLoader resolves bundle assets synchronously via +[UIImage imageNamed:],
  // and concurrent lookups corrupt CUICatalog's cache. Network downloads still overlap.
  static dispatch_queue_t imageLoadQueue;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    imageLoadQueue = dispatch_queue_create("org.maplibre.reactnative.ImageQueueOperation",
                                           DISPATCH_QUEUE_SERIAL);
  });
  dispatch_async(imageLoadQueue, ^{
    if (strongSelf.isCancelled) {
      return;
    }

    [strongSelf
        setCancellationBlock:[strongSelf.imageLoader loadImageWithURLRequest:strongSelf.urlRequest
                                 size:CGSizeZero
                                 scale:strongSelf.scale
                                 clipped:YES
                                 resizeMode:RCTResizeModeStretch
                                 progressBlock:^(int64_t progress, int64_t total) {
                                   // No-op
                                 }
                                 partialLoadBlock:^(UIImage *image) {
                                   // No-op
                                 }
                                 completionBlock:^void(NSError *error, UIImage *image) {
                                   if (image && strongSelf.sdf) {
                                     image = [image
                                         imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
                                   }
                                   if (strongSelf.completionHandler) {
                                     strongSelf.completionHandler(error, image);
                                   }
                                   [strongSelf setState:IOState_Finished only:IOState_Executing];
                                 }]];
    if (strongSelf.isCancelled) {
      [strongSelf callCancellationBlock];
    }
  });
}

- (void)cancel {
  if ([self setState:IOState_CancelledDoNotExecute except:IOState_Finished] == IOState_Executing) {
    [self callCancellationBlock];
  }
}

@end
