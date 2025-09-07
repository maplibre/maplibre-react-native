#import "MLRNCameraManager.h"
#import "MLRNCamera.h"

@implementation MLRNCameraManager

- (BOOL)requiresMainQueueSetup {
  return YES;
}

- (UIView *)view {
  return [[MLRNCamera alloc] init];
}

// MARK: - React View Methods

- (void)setStop:(MLRNCamera *)view
           stop:(NSDictionary<NSString *, id> *)stop
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  [view setStop:stop];
  resolve(nil);
}

@end
