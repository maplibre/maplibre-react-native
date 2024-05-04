//
//  RCTMGLUserLocation.h
//  RCTMGL

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface RCTMGLUserLocation : NSObject

+ (id)sharedInstance;

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation;

@end
