#import <QuartzCore/QuartzCore.h>
#import "MLNUserLocationHeadingIndicator.h"
@import MapLibre;

@interface MLNUserLocationHeadingBeamLayer : CALayer <MLNUserLocationHeadingIndicator>

- (MLNUserLocationHeadingBeamLayer *)initWithUserLocationAnnotationView:(MLNUserLocationAnnotationView *)userLocationView;
- (void)updateHeadingAccuracy:(CLLocationDirection)accuracy;
- (void)updateTintColor:(CGColorRef)color;

@end
