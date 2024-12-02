#import "MLRNNativeUserLocationManager.h"
#import "MLRNNativeUserLocation.h"

@implementation MLRNNativeUserLocationManager

RCT_EXPORT_MODULE(MLRNNativeUserLocation)
RCT_EXPORT_VIEW_PROPERTY(iosShowsUserHeadingIndicator, BOOL)


#pragma - View Properties


#pragma Methods

- (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[MLRNNativeUserLocation alloc] init];
}

@end
