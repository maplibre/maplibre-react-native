#import <QuartzCore/QuartzCore.h>
#import "MGLUserLocationHeadingIndicator.h"
@import MapLibre;

@interface MGLUserLocationHeadingBeamLayer : CALayer <MGLUserLocationHeadingIndicator>

- (MGLUserLocationHeadingBeamLayer *)initWithUserLocationAnnotationView:(MLNUserLocationAnnotationView *)userLocationView;
- (void)updateHeadingAccuracy:(CLLocationDirection)accuracy;
- (void)updateTintColor:(CGColorRef)color;

@end
