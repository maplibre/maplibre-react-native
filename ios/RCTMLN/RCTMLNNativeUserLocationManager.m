#import "RCTMLNNativeUserLocationManager.h"
#import "RCTMLNNativeUserLocation.h"

@implementation RCTMLNNativeUserLocationManager

RCT_EXPORT_MODULE(RCTMLNNativeUserLocation)
RCT_EXPORT_VIEW_PROPERTY(iosShowsUserHeadingIndicator, BOOL)


#pragma - View Properties


#pragma Methods

- (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[RCTMLNNativeUserLocation alloc] init];
}

@end
