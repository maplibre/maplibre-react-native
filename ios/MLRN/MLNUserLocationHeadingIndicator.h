#import <QuartzCore/QuartzCore.h>
@import MapLibre;

@protocol MLNUserLocationHeadingIndicator <NSObject>

- (instancetype)initWithUserLocationAnnotationView:(MLNUserLocationAnnotationView *)userLocationView;
- (void)updateHeadingAccuracy:(CLLocationDirection)accuracy;
- (void)updateTintColor:(CGColorRef)color;

@end
