#import "MLRNNativeUserLocation.h"
#import "CameraStop.h"
#import "CameraUpdateQueue.h"
#import "MLRNLocation.h"
#import "MLRNUtils.h"
#import "MLRNLocationManager.h"
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "CameraMode.h"

@implementation MLRNNativeUserLocation
{
    
}

- (void)setMap:(MLRNMapView *)map
{
    if (map == nil && _map) {
        _map.useNativeUserLocationAnnotationView = NO;
        _map.showsUserLocation = NO;
        _map.showsUserHeadingIndicator = NO;
    } else if (map) {
        map.useNativeUserLocationAnnotationView = YES;
        // Toggle off/on showsUserLocation in order for Mapbox to invalidate the
        // current (hidden) user location annotation view. See also: HiddenUserLocationAnnotationView
        map.showsUserLocation = NO;
        map.showsUserLocation = YES;
        map.showsUserHeadingIndicator = self.iosShowsUserHeadingIndicator;
    }
    
    _map = map;
}

- (void)setIosShowsUserHeadingIndicator:(BOOL)iosShowsUserHeadingIndicator {
    _iosShowsUserHeadingIndicator = iosShowsUserHeadingIndicator;
    if (_map) {
        _map.showsUserHeadingIndicator = iosShowsUserHeadingIndicator;
    }
}

@end
