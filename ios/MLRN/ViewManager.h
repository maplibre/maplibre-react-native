#import <React/RCTViewManager.h>
#import "MLRNEvent.h"

@interface ViewManager : RCTViewManager

-(void)fireEvent:(MLRNEvent*)event withCallback:(RCTBubblingEventBlock)callback;

@end
