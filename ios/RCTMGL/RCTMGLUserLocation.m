//
//  RCTMGLUserLocation.m
//  RCTMGL
//

#import "RCTMGLUserLocation.h"
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface HiddenUserLocationAnnotationView : MLNUserLocationAnnotationView

@end

@implementation HiddenUserLocationAnnotationView


- (void)update {
    self.frame = CGRectNull;
}

@end


@implementation RCTMGLUserLocation : NSObject

+ (id)sharedInstance
{
    static RCTMGLUserLocation *userLocation = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ userLocation = [[self alloc] init]; });
    return userLocation;
}

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation
{
    return [[HiddenUserLocationAnnotationView alloc] init];
}

@end
