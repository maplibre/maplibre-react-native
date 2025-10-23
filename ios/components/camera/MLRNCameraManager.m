#import "MLRNCameraManager.h"
#import "MLRNCamera.h"

@implementation MLRNCameraManager

- (UIView *)view {
  return [[MLRNCamera alloc] init];
}

// MARK: - React View Methods

+ (void)setStop:(MLRNCamera *)view
           stop:(NSDictionary<NSString *, id> *)stop
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  [view setStop:stop];
  [view updateCamera];
  resolve(nil);
}

@end
