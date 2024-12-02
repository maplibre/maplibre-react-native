#import "MLRNCameraManager.h"
#import "MLRNCamera.h"

@implementation MLRNCameraManager

RCT_EXPORT_MODULE(MLRNCamera)

#pragma - View Properties

RCT_EXPORT_VIEW_PROPERTY(stop, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(followUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(followUserMode, NSString)
RCT_EXPORT_VIEW_PROPERTY(followZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(followPitch, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(followHeading, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(alignment, NSString)

RCT_EXPORT_VIEW_PROPERTY(maxBounds, NSString)

RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(onUserTrackingModeChange, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(defaultStop, NSDictionary)

#pragma Methods

- (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[MLRNCamera alloc] init];
}

@end
