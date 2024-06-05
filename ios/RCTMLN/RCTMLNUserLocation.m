//
//  RCTMLNUserLocation.m
//  RCTMLN
//

#import "RCTMLNUserLocation.h"
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface HiddenUserLocationAnnotationView : MLNUserLocationAnnotationView

@end

@implementation HiddenUserLocationAnnotationView


- (void)update {
    self.frame = CGRectNull;
}

@end


@implementation RCTMLNUserLocation : NSObject

+ (id)sharedInstance
{
    static RCTMLNUserLocation *userLocation = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ userLocation = [[self alloc] init]; });
    return userLocation;
}

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation
{
    return [[HiddenUserLocationAnnotationView alloc] init];
}

@end
