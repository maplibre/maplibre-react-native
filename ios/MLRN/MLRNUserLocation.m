//
//  MLRNUserLocation.m
//  MLRN
//

#import "MLRNUserLocation.h"
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface HiddenUserLocationAnnotationView : MLNUserLocationAnnotationView

@end

@implementation HiddenUserLocationAnnotationView


- (void)update {
    self.frame = CGRectNull;
}

@end


@implementation MLRNUserLocation : NSObject

+ (id)sharedInstance
{
    static MLRNUserLocation *userLocation = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ userLocation = [[self alloc] init]; });
    return userLocation;
}

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation
{
    return [[HiddenUserLocationAnnotationView alloc] init];
}

@end
