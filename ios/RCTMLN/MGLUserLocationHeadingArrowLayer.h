#import <QuartzCore/QuartzCore.h>
#import "MGLUserLocationHeadingIndicator.h"
@import MapLibre;

@interface MGLUserLocationHeadingArrowLayer : CAShapeLayer <MGLUserLocationHeadingIndicator>

- (instancetype)initWithUserLocationAnnotationView:(MLNUserLocationAnnotationView *)userLocationView;
- (void)updateHeadingAccuracy:(CLLocationDirection)accuracy;
- (void)updateTintColor:(CGColorRef)color;

@end
