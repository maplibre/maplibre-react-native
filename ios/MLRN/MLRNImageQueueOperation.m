#import "MLRNImageQueueOperation.h"

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
  __weak MLRNImageQueueOperation *weakSelf = self;
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [weakSelf
        setCancellationBlock:[[weakSelf.bridge moduleForName:@"ImageLoader"
                                       lazilyLoadIfNecessary:YES]
                                 loadImageWithURLRequest:weakSelf.urlRequest
                                                    size:CGSizeZero
                                                   scale:weakSelf.scale
                                                 clipped:YES
                                              resizeMode:RCTResizeModeStretch
                                           progressBlock:nil
                                        partialLoadBlock:nil
                                         completionBlock:^void(NSError *error, UIImage *image) {
                                          if (image && weakSelf.sdf) {
                                            image = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
                                          }
                                          weakSelf.completionHandler(error, image);
                                          [weakSelf setState:IOState_Finished
                                                       except:IOState_Finished];
                                         }]];
    if ([weakSelf setState:IOState_Executing
                      only:IOState_Initial] == IOState_CancelledDoNotExecute) {
      [weakSelf callCancellationBlock];
    }
  });
}

- (void)cancel {
  if ([self setState:IOState_CancelledDoNotExecute except:IOState_Finished] == IOState_Executing) {
    [self callCancellationBlock];
  }
}

@end
