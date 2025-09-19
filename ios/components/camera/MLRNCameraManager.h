#import "MLRNCamera.h"
#import "ViewManager.h"

@interface MLRNCameraManager : ViewManager

+ (void)setStop:(MLRNCamera *)view
           stop:(NSDictionary<NSString *, id> *)stop
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;

@end
